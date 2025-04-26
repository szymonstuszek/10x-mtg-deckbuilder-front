import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Card, CardFilters, DeckMetadata, DeckValidity, PaginationState } from '../../models/deck.models';
import * as DeckActions from '../../store/deck/deck.actions';
import * as CardListActions from '../../store/card-list/card-list.actions';
import { 
  selectCards, 
  selectCardFilters, 
  selectCardListIsLoading, 
  selectCardListPagination 
} from '../../store/card-list/card-list.selectors';
import { 
  selectDeckCards, 
  selectDeckMetadata, 
  selectDeckValidity, 
  selectGroupedDeckCards, 
  selectDeckIsSaving 
} from '../../store/deck/deck.selectors';

@Component({
  selector: 'app-deck-builder-view',
  templateUrl: './deck-builder-view.component.html',
  styleUrls: ['./deck-builder-view.component.scss'],
  standalone: false
})
export class DeckBuilderViewComponent implements OnInit, OnDestroy {
  // Card list observables
  cards$: Observable<Card[]>;
  cardListPagination$: Observable<PaginationState>;
  cardListLoading$: Observable<boolean>;
  cardFilters$: Observable<CardFilters>;
  
  // Deck observables
  deckMetadata$: Observable<DeckMetadata>;
  deckValidity$: Observable<DeckValidity>;
  groupedCards$: Observable<Map<string, any[]>>;
  deckIsSaving$: Observable<boolean>;
  
  // Unsubscribe notifier
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    // Initialize observables
    this.cards$ = this.store.select(selectCards);
    this.cardListPagination$ = this.store.select(selectCardListPagination);
    this.cardListLoading$ = this.store.select(selectCardListIsLoading);
    this.cardFilters$ = this.store.select(selectCardFilters);
    
    this.deckMetadata$ = this.store.select(selectDeckMetadata);
    this.deckValidity$ = this.store.select(selectDeckValidity);
    this.groupedCards$ = this.store.select(selectGroupedDeckCards);
    this.deckIsSaving$ = this.store.select(selectDeckIsSaving);
  }

  ngOnInit(): void {
    // Check for deck ID in route parameter
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const deckId = params['deckId'];
      if (deckId) {
        this.store.dispatch(DeckActions.loadDeck({ deckId: +deckId }));
      }
    });
    
    // Load initial card list
    this.store.dispatch(CardListActions.loadCards());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Handler for deck header interactions
  onDeckNameChanged(name: string): void {
    this.store.dispatch(DeckActions.updateDeckName({ name }));
  }
  
  onSaveClicked(): void {
    this.store.dispatch(DeckActions.saveDeck());
  }
  
  onNewClicked(): void {
    this.store.dispatch(DeckActions.createNewDeck());
  }
  
  // Handler for card search filter interactions
  onFiltersChanged(filters: CardFilters): void {
    this.store.dispatch(CardListActions.updateCardListFilters({ filters }));
  }
  
  // Handler for card table interactions
  onPageChanged(event: PageEvent): void {
    const pagination: PaginationState = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      totalItems: event.length
    };
    this.store.dispatch(CardListActions.updateCardListPage({ pagination }));
  }
  
  onSortChanged(sort: Sort): void {
    this.store.dispatch(CardListActions.updateCardListSort({ 
      sort: { 
        active: sort.active, 
        direction: sort.direction 
      } 
    }));
  }
  
  onAddCard(card: Card): void {
    this.store.dispatch(DeckActions.addCardToDeck({ card }));
  }
  
  // Handler for deck summary interactions
  onRemoveCard(card: Card): void {
    this.store.dispatch(DeckActions.removeCardFromDeck({ card }));
  }
} 