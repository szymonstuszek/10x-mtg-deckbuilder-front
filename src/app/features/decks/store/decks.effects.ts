import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import * as DecksActions from './decks.actions';
import { loadDeck as loadDeckBuilderDeck } from '../../deck-builder/store/deck/deck.actions';
import { DeckService } from '../services/deck.service';
import { DeckMeta, BackendDeckDto, RandomCardResponse } from '../models/deck.model';
// Assuming a global AppState or at least access to Deck Builder actions if they exist
// import * as DeckBuilderActions from '@app/features/deck-builder/store/deck-builder.actions';

@Injectable()
export class DecksEffects {
  private actions$ = inject(Actions);
  private deckService = inject(DeckService);
  private router = inject(Router);
  private store = inject(Store); // If needed for other operations, e.g. DeckBuilderActions
  private snackBar = inject(MatSnackBar);

  loadDecks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DecksActions.loadDecks),
      switchMap(() =>
        this.deckService.getDecks().pipe(
          switchMap((backendDecks: BackendDeckDto[]) => {
            if (!backendDecks || backendDecks.length === 0) {
              return of(DecksActions.loadDecksSuccess({ decks: [] }));
            }
            const deckMetaCalls = backendDecks.map((deckDto) =>
              this.deckService.getRandomCardImage(deckDto.id).pipe(
                map((randomCardResponse: RandomCardResponse) => {
                  const deckMeta: DeckMeta = {
                    id: deckDto.id,
                    deckName: deckDto.deckName,
                    deckFormat: deckDto.deckFormat,
                    representativeImageUrl: randomCardResponse?.card?.imageUrl || null,
                  };
                  return deckMeta;
                }),
                catchError(() => {
                  // For a failed image call, still create DeckMeta with null image
                  // This ensures the deck is still listed.
                  const deckMeta: DeckMeta = {
                    id: deckDto.id,
                    deckName: deckDto.deckName,
                    deckFormat: deckDto.deckFormat,
                    representativeImageUrl: null, 
                  };
                  return of(deckMeta); 
                })
              )
            );
            return forkJoin(deckMetaCalls).pipe(
              map((deckMetas) => { // forkJoin will now always return an array of DeckMeta (or objects that fit the structure)
                return DecksActions.loadDecksSuccess({ decks: deckMetas as DeckMeta[] });
              })
            );
          }),
          catchError((error) => {
            const errorMessage = typeof error === 'string' ? error : (error.message || 'Failed to load decks');
            // Optional: Show snackbar for load errors too, though handled in component
            // this.snackBar.open(errorMessage, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
            return of(DecksActions.loadDecksFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  deleteDeck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DecksActions.deleteDeck),
      switchMap((action) =>
        this.deckService.deleteDeck(action.deckId).pipe(
          map(() => {
            this.snackBar.open('Deck deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'] // Optional: for custom styling
            });
            return DecksActions.deleteDeckSuccess({ deckId: action.deckId });
          }),
          catchError((error) => {
            const errorMessage = typeof error === 'string' ? error : (error.message || 'Failed to delete deck');
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'] // Optional: for custom styling
            });
            return of(DecksActions.deleteDeckFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  navigateToEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DecksActions.navigateToEditDeck),
      tap((action) => {
        // Dispatch action to load deck in Deck Builder state
        this.store.dispatch(loadDeckBuilderDeck({ deckId: action.deckId }));
        console.log('NavigateToEditEffect: Dispatched loadDeckBuilderDeck for deck ID: ' + action.deckId);
        // Navigate to the deck editor route
        this.router.navigate(['/decks', action.deckId]);
      })
    ),
    { dispatch: false }
  );
} 