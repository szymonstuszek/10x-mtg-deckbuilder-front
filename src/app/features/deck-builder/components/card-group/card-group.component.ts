import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, DeckCard } from '../../models/deck.models';

@Component({
  selector: 'app-card-group',
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.scss'],
  standalone: false
})
export class CardGroupComponent {
  @Input() groupName: string = '';
  @Input() groupCount: number = 0;
  @Input() cards: DeckCard[] = [];
  
  @Output() removeCard = new EventEmitter<Card>();

  constructor() { }

  onCardRemove(card: Card): void {
    this.removeCard.emit(card);
  }
} 