import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, DeckCard } from '../../models/deck.models';

@Component({
  selector: 'app-deck-summary',
  templateUrl: './deck-summary.component.html',
  styleUrls: ['./deck-summary.component.scss'],
  standalone: false
})
export class DeckSummaryComponent {
  @Input() groupedCards?: Map<string, DeckCard[]>;
  @Output() removeCard = new EventEmitter<Card>();

  // Array of card type groups in the desired order
  readonly cardTypeDisplayOrder = [
    'Land',
    'Creature',
    'Planeswalker',
    'Artifact',
    'Enchantment',
    'Instant',
    'Sorcery',
    'Other'
  ];

  constructor() { }

  // Helper to convert the Map into an ordered array for display
  getOrderedCardGroups(): Array<{ name: string, cards: DeckCard[], count: number }> {
    if (!this.groupedCards) {
      return [];
    }

    const result: Array<{ name: string, cards: DeckCard[], count: number }> = [];

    // Process types in the specified order
    for (const typeName of this.cardTypeDisplayOrder) {
      const cards = this.groupedCards.get(typeName) || [];
      if (cards.length > 0) {
        const count = cards.reduce((total, deckCard) => total + deckCard.quantity, 0);
        result.push({ name: typeName, cards, count });
      }
    }

    return result;
  }

  // Get total count of all cards
  getTotalCardCount(): number {
    if (!this.groupedCards) {
      return 0;
    }

    let totalCount = 0;
    for (const cards of this.groupedCards.values()) {
      totalCount += cards.reduce((total, deckCard) => total + deckCard.quantity, 0);
    }

    return totalCount;
  }

  // Delegate card removal to parent component
  onRemoveCard(card: Card): void {
    this.removeCard.emit(card);
  }

  trackByCardGroup(index: number, group: { name: string, cards: DeckCard[], count: number }): string {
    return group.name;
  }
} 