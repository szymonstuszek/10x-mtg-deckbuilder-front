// Define the card interface based on the provided CardDto
export interface Card {
  apiId: string; // Unique ID from the external API (e.g., multiverseid, scryfall id)
  name: string;
  manaCost: string | null;
  cmc: number;
  colors: string[] | null;
  colorIdentity: string[] | null;
  type: string; // Full type line
  types: string[]; // e.g., ["Creature"]
  subtypes: string[] | null;
  rarity: string;
  set: string; // Set code
  setName: string;
  text: string | null; // Card text
  artist: string | null;
  number: string | null; // Collector number
  power: string | null;
  toughness: string | null;
  layout: string; // e.g., "normal", "transform"
  imageUrl: string | null; // For image popover
}

// Represents a card entry within the deck state
export interface DeckCard {
  card: Card;
  quantity: number;
}

// Ngrx state slice for the currently edited deck
export interface DeckState {
  id: number | null; // Null for a new deck
  name: string;
  format: string; // e.g., "Standard"
  description: string | null;
  cards: DeckCard[]; // Flat list of cards in the deck
  isValid: boolean;
  validationMessages: string[];
  isLoading: boolean; // Loading this deck
  isSaving: boolean; // Saving this deck
  error: string | null;
}

// Ngrx state slice for the available card list
export interface CardListState {
  cards: Card[];
  pagination: PaginationState;
  sort: SortState;
  filters: CardFilters;
  isLoading: boolean;
  error: string | null;
}

// Pagination state (aligned with MatPaginator)
export interface PaginationState {
  pageIndex: number; // 0-based
  pageSize: number;
  totalItems: number;
}

// Sorting state (aligned with MatSort)
export interface SortState {
  active: string; // Column name
  direction: 'asc' | 'desc' | '';
}

// Filters for the card list
export interface CardFilters {
  name: string | null;
  set: string | null;
  rarity: string[] | null; // Allow multiple
  color: string[] | null; // Allow multiple
  type: string[] | null; // Allow multiple
  manaCost: number | null; // Or range? Keep simple first.
}

// Input type for DeckHeaderComponent
export interface DeckMetadata {
  id: number | null;
  name: string;
  format: string;
}

// Input type for DeckHeaderComponent (validity part)
export interface DeckValidity {
  isValid: boolean;
  messages: string[];
}

// ---- Request DTOs ----

// Represents a card within a deck for save requests
export interface DeckCardRequestDto {
  quantity: number;
  card: Card;
}

// Payload for POST /decks
export interface CreateDeckRequestDto {
  deckName: string;
  deckFormat: string; // "Standard" initially
  deckDescription: string | null;
  cards: DeckCardRequestDto[];
}

// Payload for PUT /decks/{deckId}
export interface UpdateDeckRequestDto {
  deckName: string;
  deckDescription: string | null;
  cards: DeckCardRequestDto[]; // Complete list replaces the old one
}

// ---- Response DTOs ----

export interface CardListResponseDto {
  cards: Card[];
  pagination: {
    page: number; // 1-based from API
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface DeckDto {
  id: number;
  deckName: string;
  deckFormat: string;
  deckDescription: string | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface DeckStatisticsDto {
  totalCards: number;
  types: { [key: string]: number }; // e.g., { "Creature": 40, ... }
  manaCurve: { [key: string]: number }; // e.g., { "1": 5, "2": 10, ... }
  colors: { [key: string]: number }; // e.g., { "White": 30, ... }
}

export interface DeckDetailsDto {
  id: number;
  deckName: string;
  deckFormat: string;
  deckDescription: string | null;
  createdAt: string;
  updatedAt: string;
  cards: DeckCardRequestDto[];
  statistics: DeckStatisticsDto;
} 