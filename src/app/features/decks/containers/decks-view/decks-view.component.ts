import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog.model';

import { DeckMeta } from '../../models/deck.model';
import * as DecksActions from '../../store/decks.actions';
import * as fromDecks from '../../store/decks.selectors';
import { DecksState } from '../../store/decks.state';

@Component({
  selector: 'app-decks-view',
  templateUrl: './decks-view.component.html',
  styleUrls: ['./decks-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DecksViewComponent implements OnInit {
  decks$: Observable<DeckMeta[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store<DecksState>, // Or AppState if DecksState is part of a larger AppState
    public dialog: MatDialog // public for template access if needed, or private if only used in .ts
  ) {
    this.decks$ = this.store.select(fromDecks.selectDecksList);
    this.isLoading$ = this.store.select(fromDecks.selectDecksLoading);
    this.error$ = this.store.select(fromDecks.selectDecksError);
  }

  ngOnInit(): void {
    this.store.dispatch(DecksActions.loadDecks());
  }

  trackByDeckId(index: number, deck: DeckMeta): number {
    return deck.id;
  }

  onEditDeck(deckId: number): void {
    this.store.dispatch(DecksActions.navigateToEditDeck({ deckId }));
  }

  onDeleteDeck(deckId: number): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this deck? This action cannot be undone.',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(DecksActions.deleteDeck({ deckId }));
      }
    });
  }
} 