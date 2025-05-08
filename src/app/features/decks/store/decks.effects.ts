import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import * as DecksActions from './decks.actions';
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
                    deckName: deckDto.deck_name, 
                    deckFormat: deckDto.deck_format,
                    representativeImageUrl: randomCardResponse?.card?.imageUrl || null,
                  };
                  return deckMeta;
                }),
                catchError(() => {
                  // For a failed image call, still create DeckMeta with null image
                  // This ensures the deck is still listed.
                  const deckMeta: DeckMeta = {
                    id: deckDto.id,
                    deckName: deckDto.deck_name,
                    deckFormat: deckDto.deck_format,
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
            const errorMessage = error.message || 'Failed to load decks';
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
          map(() => DecksActions.deleteDeckSuccess({ deckId: action.deckId })),
          catchError((error) => {
            const errorMessage = error.message || 'Failed to delete deck';
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
        // Placeholder: Dispatch action to load deck in Deck Builder state
        // Example: this.store.dispatch(DeckBuilderActions.loadDeckForEdit({ deckId: action.deckId }));
        console.log('NavigateToEditEffect: Dispatching action to load deck for edit (ID: ' + action.deckId + ') in DeckBuilder state - (Placeholder)');
        this.router.navigate(['/']);
      })
    ),
    { dispatch: false }
  );
} 