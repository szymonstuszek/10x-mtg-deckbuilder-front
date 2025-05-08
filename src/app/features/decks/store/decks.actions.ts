import { createAction, props } from '@ngrx/store';
import { DeckMeta } from '../models/deck.model';

// Load Decks
export const loadDecks = createAction(
  '[Decks View] Load Decks'
);

export const loadDecksSuccess = createAction(
  '[Decks API] Load Decks Success',
  props<{ decks: DeckMeta[] }>()
);

export const loadDecksFailure = createAction(
  '[Decks API] Load Decks Failure',
  props<{ error: string }>()
);

// Delete Deck
export const deleteDeck = createAction(
  '[Decks View] Delete Deck',
  props<{ deckId: number }>()
);

export const deleteDeckSuccess = createAction(
  '[Decks API] Delete Deck Success',
  props<{ deckId: number }>()
);

export const deleteDeckFailure = createAction(
  '[Decks API] Delete Deck Failure',
  props<{ error: string }>()
);

// Navigate to Edit Deck
export const navigateToEditDeck = createAction(
  '[Decks View] Navigate To Edit Deck',
  props<{ deckId: number }>()
); 