import { createReducer, on } from '@ngrx/store';
import { DeckCard, DeckState } from '../../models/deck.models';
import * as DeckActions from './deck.actions';

export const initialState: DeckState = {
  id: null,
  name: 'New Deck',
  format: 'Standard',
  description: null,
  cards: [],
  isValid: false,
  validationMessages: ['A deck must contain at least 60 cards'],
  isLoading: false,
  isSaving: false,
  error: null
};

export const deckReducer = createReducer(
  initialState,
  
  // Load Deck
  on(DeckActions.loadDeck, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(DeckActions.loadDeckSuccess, (state, { deckDetails }) => {
    const cards: DeckCard[] = deckDetails.cards.map(card => ({
      card: card.card,
      quantity: card.quantity
    }));
    
    return {
      ...state,
      id: deckDetails.id,
      name: deckDetails.deckName,
      format: deckDetails.deckFormat,
      description: deckDetails.deckDescription,
      cards,
      isLoading: false,
      isValid: validateDeckState(cards).isValid,
      validationMessages: validateDeckState(cards).messages
    };
  }),
  
  on(DeckActions.loadDeckFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Create New Deck
  on(DeckActions.createNewDeck, () => ({
    ...initialState
  })),
  
  // Update Deck Properties
  on(DeckActions.updateDeckName, (state, { name }) => ({
    ...state,
    name
  })),
  
  on(DeckActions.updateDeckDescription, (state, { description }) => ({
    ...state,
    description
  })),
  
  on(DeckActions.updateDeckFormat, (state, { format }) => ({
    ...state,
    format
  })),
  
  // Modify Deck Cards
  on(DeckActions.addCardToDeck, (state, { card }) => {
    const existingCardIndex = state.cards.findIndex(
      (deckCard) => deckCard.card.apiId === card.apiId
    );
    
    let updatedCards: DeckCard[];
    
    if (existingCardIndex >= 0) {
      // Card already exists, increment quantity
      updatedCards = [...state.cards];
      updatedCards[existingCardIndex] = {
        ...updatedCards[existingCardIndex],
        quantity: updatedCards[existingCardIndex].quantity + 1
      };
    } else {
      // Add new card with quantity 1
      updatedCards = [
        ...state.cards,
        { card, quantity: 1 }
      ];
    }
    
    const validation = validateDeckState(updatedCards);
    
    return {
      ...state,
      cards: updatedCards,
      isValid: validation.isValid,
      validationMessages: validation.messages
    };
  }),
  
  on(DeckActions.removeCardFromDeck, (state, { card }) => {
    const updatedCards = state.cards.filter(
      (deckCard) => deckCard.card.apiId !== card.apiId
    );
    
    const validation = validateDeckState(updatedCards);
    
    return {
      ...state,
      cards: updatedCards,
      isValid: validation.isValid,
      validationMessages: validation.messages
    };
  }),
  
  on(DeckActions.decrementCardQuantity, (state, { card }) => {
    const existingCardIndex = state.cards.findIndex(
      (deckCard) => deckCard.card.apiId === card.apiId
    );
    
    if (existingCardIndex < 0) {
      // Card doesn't exist, return current state
      return state;
    }
    
    const currentQuantity = state.cards[existingCardIndex].quantity;
    let updatedCards: DeckCard[];
    
    if (currentQuantity <= 1) {
      // Remove card if quantity would become 0
      updatedCards = state.cards.filter(
        (deckCard) => deckCard.card.apiId !== card.apiId
      );
    } else {
      // Decrement quantity
      updatedCards = [...state.cards];
      updatedCards[existingCardIndex] = {
        ...updatedCards[existingCardIndex],
        quantity: currentQuantity - 1
      };
    }
    
    const validation = validateDeckState(updatedCards);
    
    return {
      ...state,
      cards: updatedCards,
      isValid: validation.isValid,
      validationMessages: validation.messages
    };
  }),
  
  on(DeckActions.incrementCardQuantity, (state, { card }) => {
    const existingCardIndex = state.cards.findIndex(
      (deckCard) => deckCard.card.apiId === card.apiId
    );
    
    if (existingCardIndex < 0) {
      // Card doesn't exist, return current state
      return state;
    }
    
    const updatedCards = [...state.cards];
    updatedCards[existingCardIndex] = {
      ...updatedCards[existingCardIndex],
      quantity: updatedCards[existingCardIndex].quantity + 1
    };
    
    const validation = validateDeckState(updatedCards);
    
    return {
      ...state,
      cards: updatedCards,
      isValid: validation.isValid,
      validationMessages: validation.messages
    };
  }),
  
  on(DeckActions.updateCardQuantity, (state, { card, quantity }) => {
    const existingCardIndex = state.cards.findIndex(
      (deckCard) => deckCard.card.apiId === card.apiId
    );
    
    let updatedCards: DeckCard[];
    
    if (quantity <= 0) {
      // Remove card if quantity is 0 or negative
      updatedCards = state.cards.filter(
        (deckCard) => deckCard.card.apiId !== card.apiId
      );
    } else if (existingCardIndex >= 0) {
      // Update existing card
      updatedCards = [...state.cards];
      updatedCards[existingCardIndex] = {
        ...updatedCards[existingCardIndex],
        quantity
      };
    } else {
      // Add new card with specified quantity
      updatedCards = [
        ...state.cards,
        { card, quantity }
      ];
    }
    
    const validation = validateDeckState(updatedCards);
    
    return {
      ...state,
      cards: updatedCards,
      isValid: validation.isValid,
      validationMessages: validation.messages
    };
  }),
  
  // Validate Deck
  on(DeckActions.validateDeck, (state) => {
    const validation = validateDeckState(state.cards);
    
    return {
      ...state,
      isValid: validation.isValid,
      validationMessages: validation.messages
    };
  }),
  
  // Save Deck
  on(DeckActions.saveDeck, (state) => ({
    ...state,
    isSaving: true,
    error: null
  })),
  
  on(DeckActions.saveDeckSuccess, (state, { id }) => ({
    ...state,
    id,
    isSaving: false
  })),
  
  on(DeckActions.saveDeckFailure, (state, { error }) => ({
    ...state,
    isSaving: false,
    error
  }))
);

// Helper function to validate deck
function validateDeckState(cards: DeckCard[]): { isValid: boolean, messages: string[] } {
  const messages: string[] = [];
  
  // Calculate total cards
  const totalCards = cards.reduce((sum, deckCard) => sum + deckCard.quantity, 0);
  
  // Check minimum 60 cards
  if (totalCards < 60) {
    messages.push(`A deck must contain at least 60 cards (currently ${totalCards})`);
  }
  
  // Check maximum 4 copies of any card unless it's a Land
  cards.forEach(deckCard => {
    const isLand = deckCard.card.types.includes('Land');
    
    if (!isLand && deckCard.quantity > 4) {
      messages.push(`A deck can't contain more than 4 copies of ${deckCard.card.name} (currently ${deckCard.quantity})`);
    }
  });
  
  return {
    isValid: messages.length === 0,
    messages
  };
} 