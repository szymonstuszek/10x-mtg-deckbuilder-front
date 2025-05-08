import { createReducer, on } from '@ngrx/store';
import * as DecksActions from './decks.actions';
import { initialDecksState, DecksState } from './decks.state';

export const decksFeatureKey = 'decks';

export const reducer = createReducer(
  initialDecksState,
  on(DecksActions.loadDecks, (state): DecksState => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(DecksActions.loadDecksSuccess, (state, { decks }): DecksState => ({
    ...state,
    decks,
    isLoading: false,
    error: null,
  })),
  on(DecksActions.loadDecksFailure, (state, { error }): DecksState => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(DecksActions.deleteDeck, (state): DecksState => ({
    ...state,
    isLoading: true, // Or a specific deleting flag
    error: null,
  })),
  on(DecksActions.deleteDeckSuccess, (state, { deckId }): DecksState => ({
    ...state,
    decks: state.decks.filter(deck => deck.id !== deckId),
    isLoading: false,
    error: null,
  })),
  on(DecksActions.deleteDeckFailure, (state, { error }): DecksState => ({
    ...state,
    isLoading: false,
    error,
  })),
  // navigateToEditDeck does not change this state slice directly, handled by effects.
); 