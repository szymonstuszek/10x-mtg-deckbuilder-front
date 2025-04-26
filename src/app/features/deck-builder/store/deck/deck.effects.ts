import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import * as DeckActions from './deck.actions';
import { DeckService } from '../../services/deck.service';
import { Card, CreateDeckRequestDto, DeckCardRequestDto, UpdateDeckRequestDto } from '../../models/deck.models';
import { selectDeckState } from './deck.selectors';

@Injectable()
export class DeckEffects {
  private actions$ = inject(Actions);
  private deckService = inject(DeckService);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  // Load a deck by ID
  loadDeck$ = createEffect(() => this.actions$.pipe(
    ofType(DeckActions.loadDeck),
    switchMap(({ deckId }) => 
      this.deckService.getDeckById(deckId).pipe(
        map(deckDetails => DeckActions.loadDeckSuccess({ deckDetails })),
        catchError(error => {
          this.snackBar.open(`Error loading deck: ${error.message}`, 'Close', {
            duration: 5000
          });
          return of(DeckActions.loadDeckFailure({ error: error.message }));
        })
      )
    )
  ));
  
  // Save the current deck (create new or update existing)
  saveDeck$ = createEffect(() => this.actions$.pipe(
    ofType(DeckActions.saveDeck),
    withLatestFrom(this.store.select(selectDeckState)),
    switchMap(([_, deck]) => {
      // Prepare the cards DTO
      // todo review: made createDeckCards to match the backend type
      const cards: DeckCardRequestDto[] = deck.cards.map(deckCard => ({
        quantity: deckCard.quantity,
        card: deckCard.card
      }));

      const createDeckCards: Card[] = deck.cards.map(deckCard => deckCard.card);
      
      // If deck has an ID, update it; otherwise create a new deck
      if (deck.id !== null) {
        const deckId = deck.id; // Create a local variable that TypeScript can infer as number
        const updateDto: UpdateDeckRequestDto = {
          deckName: deck.name,
          deckDescription: deck.description,
          cards
        };
        
        return this.deckService.updateDeck(deckId, updateDto).pipe(
          map(() => {
            this.snackBar.open('Deck updated successfully', 'Close', {
              duration: 3000
            });
            return DeckActions.saveDeckSuccess({ id: deckId });
          }),
          catchError(error => {
            this.snackBar.open(`Error saving deck: ${error.message}`, 'Close', {
              duration: 5000
            });
            return of(DeckActions.saveDeckFailure({ error: error.message }));
          })
        );
      } else {
        const createDto: CreateDeckRequestDto = {
          deckName: deck.name,
          deckFormat: deck.format,
          deckDescription: deck.description,
          cards: createDeckCards
        };

        return this.deckService.createDeck(createDto).pipe(
          map(response => {
            this.snackBar.open('Deck created successfully', 'Close', {
              duration: 3000
            });
            
            // Navigate to the deck detail page
            this.router.navigate(['/decks', response.id]);
            
            return DeckActions.saveDeckSuccess({ id: response.id });
          }),
          catchError(error => {
            this.snackBar.open(`Error creating deck: ${error.message}`, 'Close', {
              duration: 5000
            });
            return of(DeckActions.saveDeckFailure({ error: error.message }));
          })
        );
      }
    })
  ));
  
  constructor() {
    console.log('DeckEffects constructor');
  }
} 