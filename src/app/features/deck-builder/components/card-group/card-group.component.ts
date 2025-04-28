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

  // todo review: there's some issue with removing, works if only 1 item,
  // if there is multiple, it will remove and update the count only after all items are removed
  // also seems that the mat tooltip on the inner item prevents from clicking
  // check also overlay
  onCardRemove(card: Card): void {
    this.removeCard.emit(card);
  }
} 