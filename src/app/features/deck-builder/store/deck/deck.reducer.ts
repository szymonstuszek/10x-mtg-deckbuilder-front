import { createReducer, on } from '@ngrx/store';
import { DeckCard, DeckState, Card } from '../../models/deck.models';
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
    // Assuming deckDetails.cards is an array of backend card objects
    // where each object has quantity, cardText, and other card properties.
    // Example backend card: { apiId, name, quantity, cardText, id (string UUID), ... }
    const rawCardsFromBackend = (deckDetails as any).cards || [];

    const processedCards: DeckCard[] = rawCardsFromBackend.map((backendCard: any) => {
      const {
        // Fields for frontend Card model - destructure all that are available
        apiId, name, manaCost, cmc, colors, colorIdentity, type, types, subtypes, rarity, set, setName,
        cardText, // Backend uses cardText
        artist, number, power, toughness, layout, imageUrl,
        // Quantity is directly on the backend card object
        quantity,
        // Backend's own ID (string, e.g. UUID)
        id: backendCardStringId,
        // Other potential fields from backend
        multiverseid, originalText, originalType
      } = backendCard;

      // Construct the frontend Card object
      const frontendCard: Card = {
        apiId: apiId,
        // FIXME: Frontend Card model expects 'id: number'. Backend provides 'id: string' (backendCardStringId).
        // This is a type mismatch that cannot be resolved without model changes or a new strategy for 'id'.
        // Using a placeholder value. This needs to be addressed if Card.id is critical.
        id: -1, // Placeholder for the numeric ID
        name: name,
        manaCost: manaCost,
        cmc: cmc,
        colors: colors,
        colorIdentity: colorIdentity,
        type: type,
        types: types,
        subtypes: subtypes,
        rarity: rarity,
        set: set,
        setName: setName,
        text: cardText, // Map backend's cardText to frontend's text
        artist: artist,
        number: number,
        power: power,
        toughness: toughness,
        layout: layout,
        imageUrl: imageUrl,
        // Note: multiverseid, originalText, originalType from backendCard are not mapped
        // as they are not in the current frontend Card model definition based on previous context.
        // If they were added to Card model, they should be mapped here.
      };

      return {
        card: frontendCard,
        quantity: quantity !== undefined ? quantity : 1 // Default to 1 if quantity is missing, though it should be there
      };
    });
    
    // Handle deck metadata: backend sample shows it nested in deckInfo,
    // while DeckDetailsDto is flat. Prioritize deckInfo if it exists.
    const deckInfoSource = (deckDetails as any).deckInfo || deckDetails;

    return {
      ...state,
      id: deckInfoSource.id,
      name: deckInfoSource.deckName,
      format: deckInfoSource.deckFormat,
      description: deckInfoSource.deckDescription,
      cards: processedCards,
      isLoading: false,
      isValid: validateDeckState(processedCards).isValid,
      validationMessages: validateDeckState(processedCards).messages
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
      (deckCard) => deckCard.card.id === card.id
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
      (deckCard) => deckCard.card.id !== card.id
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
      (deckCard) => deckCard.card.id === card.id
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
        (deckCard) => deckCard.card.id !== card.id
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
      (deckCard) => deckCard.card.id === card.id
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
      (deckCard) => deckCard.card.id === card.id
    );
    
    let updatedCards: DeckCard[];
    
    if (quantity <= 0) {
      // Remove card if quantity is 0 or negative
      updatedCards = state.cards.filter(
        (deckCard) => deckCard.card.id !== card.id
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