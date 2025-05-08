import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDecks from './decks.reducer';
import { DecksState } from './decks.state';

export const selectDecksState = createFeatureSelector<DecksState>(
  fromDecks.decksFeatureKey
);

export const selectDecksList = createSelector(
  selectDecksState,
  (state: DecksState) => state.decks
);

export const selectDecksLoading = createSelector(
  selectDecksState,
  (state: DecksState) => state.isLoading
);

export const selectDecksError = createSelector(
  selectDecksState,
  (state: DecksState) => state.error
); 