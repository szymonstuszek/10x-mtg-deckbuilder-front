import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardFilters, CardListState, PaginationState, SortState } from '../../models/deck.models';

// Feature selector
export const selectDeckBuilderState = createFeatureSelector<{ deck: any, cardList: CardListState }>('deckBuilder');

// Select the card list state
export const selectCardListState = createSelector(
  selectDeckBuilderState,
  state => state.cardList
);

// Select specific parts of the card list state
export const selectCards = createSelector(
  selectCardListState,
  cardList => cardList.cards
);

export const selectCardListPagination = createSelector(
  selectCardListState,
  cardList => cardList.pagination
);

export const selectCardListSort = createSelector(
  selectCardListState,
  cardList => cardList.sort
);

export const selectCardFilters = createSelector(
  selectCardListState,
  cardList => cardList.filters
);

export const selectCardListIsLoading = createSelector(
  selectCardListState,
  cardList => cardList.isLoading
);

export const selectCardListError = createSelector(
  selectCardListState,
  cardList => cardList.error
);

// Complex selectors
export const selectCardListCurrentPage = createSelector(
  selectCardListPagination,
  (pagination: PaginationState) => pagination.pageIndex
);

export const selectCardListPageSize = createSelector(
  selectCardListPagination,
  (pagination: PaginationState) => pagination.pageSize
);

export const selectCardListTotalItems = createSelector(
  selectCardListPagination,
  (pagination: PaginationState) => pagination.totalItems
);

export const selectCardListSortColumn = createSelector(
  selectCardListSort,
  (sort: SortState) => sort.active
);

export const selectCardListSortDirection = createSelector(
  selectCardListSort,
  (sort: SortState) => sort.direction
);

export const selectCardListNameFilter = createSelector(
  selectCardFilters,
  (filters: CardFilters) => filters.name
);

export const selectCardListSetFilter = createSelector(
  selectCardFilters,
  (filters: CardFilters) => filters.set
);

export const selectCardListRarityFilter = createSelector(
  selectCardFilters,
  (filters: CardFilters) => filters.rarity
);

export const selectCardListColorFilter = createSelector(
  selectCardFilters,
  (filters: CardFilters) => filters.color
);

export const selectCardListTypeFilter = createSelector(
  selectCardFilters,
  (filters: CardFilters) => filters.type
);

export const selectCardListManaCostFilter = createSelector(
  selectCardFilters,
  (filters: CardFilters) => filters.manaCost
); 