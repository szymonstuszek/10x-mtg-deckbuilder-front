import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, DeckCard } from '../../models/deck.models';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss'],
  standalone: false
})
export class CardItemComponent {
  @Input() deckCard!: DeckCard;
  @Output() removeClicked = new EventEmitter<Card>();

  constructor() { }

  onRemove(): void {
    this.removeClicked.emit(this.deckCard.card);
  }
} 