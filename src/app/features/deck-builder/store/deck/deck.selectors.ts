import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeckCard, DeckMetadata, DeckState, DeckValidity } from '../../models/deck.models';

// Feature selector
export const selectDeckBuilderState = createFeatureSelector<{ deck: DeckState, cardList: any }>('deckBuilder');

// Select the deck state
export const selectDeckState = createSelector(
  selectDeckBuilderState,
  state => state.deck
);

// Select specific parts of the deck state
export const selectDeckId = createSelector(
  selectDeckState,
  deck => deck.id
);

export const selectDeckName = createSelector(
  selectDeckState,
  deck => deck.name
);

export const selectDeckFormat = createSelector(
  selectDeckState,
  deck => deck.format
);

export const selectDeckDescription = createSelector(
  selectDeckState,
  deck => deck.description
);

export const selectDeckCards = createSelector(
  selectDeckState,
  deck => deck.cards
);

export const selectDeckIsValid = createSelector(
  selectDeckState,
  deck => deck.isValid
);

export const selectDeckValidationMessages = createSelector(
  selectDeckState,
  deck => deck.validationMessages
);

export const selectDeckIsLoading = createSelector(
  selectDeckState,
  deck => deck.isLoading
);

export const selectDeckIsSaving = createSelector(
  selectDeckState,
  deck => deck.isSaving
);

export const selectDeckError = createSelector(
  selectDeckState,
  deck => deck.error
);

// Complex selectors
export const selectDeckMetadata = createSelector(
  selectDeckId,
  selectDeckName,
  selectDeckFormat,
  (id, name, format): DeckMetadata => ({ id, name, format })
);

export const selectDeckValidity = createSelector(
  selectDeckIsValid,
  selectDeckValidationMessages,
  (isValid, messages): DeckValidity => ({ isValid, messages })
);

export const selectDeckCardCount = createSelector(
  selectDeckCards,
  (cards: DeckCard[]) => cards.reduce((total, card) => total + card.quantity, 0)
);

// Grouped cards selector for DeckSummaryComponent
export const selectGroupedDeckCards = createSelector(
  selectDeckCards,
  (cards: DeckCard[]): Map<string, DeckCard[]> => {
    const groupedCards = new Map<string, DeckCard[]>();
    
    // Group cards by their primary type (Creature, Land, etc.)
    cards.forEach(deckCard => {
      // Determine the primary type
      let primaryType = 'Other';
      
      // Card types usually appear in a specific order, with the first type
      // being the most relevant for grouping
      const types = deckCard.card.types;
      if (types.includes('Land')) {
        primaryType = 'Land';
      } else if (types.includes('Creature')) {
        primaryType = 'Creature';
      } else if (types.includes('Planeswalker')) {
        primaryType = 'Planeswalker';
      } else if (types.includes('Artifact')) {
        primaryType = 'Artifact';
      } else if (types.includes('Enchantment')) {
        primaryType = 'Enchantment';
      } else if (types.includes('Instant')) {
        primaryType = 'Instant';
      } else if (types.includes('Sorcery')) {
        primaryType = 'Sorcery';
      }
      
      // Add or append to the group
      if (!groupedCards.has(primaryType)) {
        groupedCards.set(primaryType, []);
      }
      
      groupedCards.get(primaryType)?.push(deckCard);
    });
    
    return groupedCards;
  }
); 