import { createAction, props } from '@ngrx/store';
import { Card, CreateDeckRequestDto, DeckCard, DeckDetailsDto, UpdateDeckRequestDto } from '../../models/deck.models';

// Load Deck
export const loadDeck = createAction(
  '[Deck] Load Deck',
  props<{ deckId: number }>()
);

export const loadDeckSuccess = createAction(
  '[Deck] Load Deck Success',
  props<{ deckDetails: DeckDetailsDto }>()
);

export const loadDeckFailure = createAction(
  '[Deck] Load Deck Failure',
  props<{ error: string }>()
);

// Create New Deck
export const createNewDeck = createAction(
  '[Deck] Create New Deck'
);

// Update Deck Properties
export const updateDeckName = createAction(
  '[Deck] Update Deck Name',
  props<{ name: string }>()
);

export const updateDeckDescription = createAction(
  '[Deck] Update Deck Description',
  props<{ description: string | null }>()
);

export const updateDeckFormat = createAction(
  '[Deck] Update Deck Format',
  props<{ format: string }>()
);

// Modify Deck Cards
export const addCardToDeck = createAction(
  '[Deck] Add Card to Deck',
  props<{ card: Card }>()
);

export const removeCardFromDeck = createAction(
  '[Deck] Remove Card from Deck',
  props<{ card: Card }>()
);

export const decrementCardQuantity = createAction(
  '[Deck] Decrement Card Quantity',
  props<{ card: Card }>()
);

export const incrementCardQuantity = createAction(
  '[Deck] Increment Card Quantity',
  props<{ card: Card }>()
);

export const updateCardQuantity = createAction(
  '[Deck] Update Card Quantity',
  props<{ card: Card, quantity: number }>()
);

// Validate Deck
export const validateDeck = createAction(
  '[Deck] Validate Deck'
);

// Save Deck
export const saveDeck = createAction(
  '[Deck] Save Deck'
);

export const saveDeckSuccess = createAction(
  '[Deck] Save Deck Success',
  props<{ id: number }>()
);

export const saveDeckFailure = createAction(
  '[Deck] Save Deck Failure',
  props<{ error: string }>()
); 