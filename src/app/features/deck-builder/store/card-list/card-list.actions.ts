import { createAction, props } from '@ngrx/store';
import { Card, CardFilters, CardListResponseDto, PaginationState, SortState } from '../../models/deck.models';

// Load Cards
export const loadCards = createAction(
  '[Card List] Load Cards'
);

export const loadCardsSuccess = createAction(
  '[Card List] Load Cards Success',
  props<{ response: CardListResponseDto }>()
);

export const loadCardsFailure = createAction(
  '[Card List] Load Cards Failure',
  props<{ error: string }>()
);

// Update Card List State
export const updateCardListFilters = createAction(
  '[Card List] Update Filters',
  props<{ filters: CardFilters }>()
);

export const updateCardListPage = createAction(
  '[Card List] Update Page',
  props<{ pagination: PaginationState }>()
);

export const updateCardListSort = createAction(
  '[Card List] Update Sort',
  props<{ sort: SortState }>()
);

// Reset Card List
export const resetCardListFilters = createAction(
  '[Card List] Reset Filters'
); 