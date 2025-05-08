import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { DeckMeta } from '../../models/deck.model';

@Component({
  selector: 'app-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DeckCardComponent {
  @Input() deck: DeckMeta | null = null;
  @Output() editClicked = new EventEmitter<number>();
  @Output() deleteClicked = new EventEmitter<number>();

  onEdit(): void {
    if (this.deck) {
      this.editClicked.emit(this.deck.id);
    }
  }

  onDelete(): void {
    if (this.deck) {
      this.deleteClicked.emit(this.deck.id);
    }
  }
} 