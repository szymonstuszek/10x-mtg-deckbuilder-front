import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as CardListActions from './card-list.actions';
import { CardService } from '../../services/card.service';
import { selectCardFilters, selectCardListPagination, selectCardListSort } from './card-list.selectors';

@Injectable()
export class CardListEffects {
  
  // Load cards based on current filters, pagination, and sorting
  loadCards$ = createEffect(() => this.actions$.pipe(
    ofType(
      CardListActions.loadCards,
      CardListActions.updateCardListFilters,
      CardListActions.updateCardListPage,
      CardListActions.updateCardListSort
    ),
    // Debounce to avoid excessive API calls, especially on typing in filters
    debounceTime(300),
    withLatestFrom(
      this.store.select(selectCardFilters),
      this.store.select(selectCardListPagination),
      this.store.select(selectCardListSort)
    ),
    switchMap(([_, filters, pagination, sort]) => 
      this.cardService.getCards(filters, pagination, sort).pipe(
        map(response => CardListActions.loadCardsSuccess({ response })),
        catchError(error => {
          this.snackBar.open(`Error loading cards: ${error.message}`, 'Close', {
            duration: 5000
          });
          return of(CardListActions.loadCardsFailure({ error: error.message }));
        })
      )
    )
  ));
  
  constructor(
    private actions$: Actions,
    private cardService: CardService,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}
} 