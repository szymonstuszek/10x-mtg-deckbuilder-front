import { createReducer, on } from '@ngrx/store';
import { CardFilters, CardListState } from '../../models/deck.models';
import * as CardListActions from './card-list.actions';

// Initial filters
const initialFilters: CardFilters = {
  name: null,
  set: null,
  rarity: null,
  color: null,
  type: null,
  manaCost: null
};

// Initial state
export const initialState: CardListState = {
  cards: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0
  },
  sort: {
    active: 'name',
    direction: 'asc'
  },
  filters: initialFilters,
  isLoading: false,
  error: null
};

export const cardListReducer = createReducer(
  initialState,
  
  // Load Cards
  on(CardListActions.loadCards, (state: any) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(CardListActions.loadCardsSuccess, (state: any, { response }) => ({
    ...state,
    cards: response.cards,
    // temp make pagination optional
    pagination: response.pagination ? {
      pageIndex: response.pagination.page - 1, // Convert from 1-based to 0-based
      pageSize: response.pagination.pageSize,
      totalItems: response.pagination.totalRecords
    } : null,
    isLoading: false
  })),
  
  on(CardListActions.loadCardsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Update Card List State
  on(CardListActions.updateCardListFilters, (state, { filters }) => ({
    ...state,
    filters,
    // Reset to first page when filters change
    pagination: {
      ...state.pagination,
      pageIndex: 0
    }
  })),
  
  on(CardListActions.updateCardListPage, (state, { pagination }) => ({
    ...state,
    pagination
  })),
  
  on(CardListActions.updateCardListSort, (state, { sort }) => ({
    ...state,
    sort
  })),
  
  // Reset Card List
  on(CardListActions.resetCardListFilters, (state) => ({
    ...state,
    filters: initialFilters,
    pagination: {
      ...state.pagination,
      pageIndex: 0
    }
  }))
); 