# Deck Builder View Implementation Plan

## 1. Overview

This document outlines the implementation plan for the Deck Builder view, the primary interface for creating and editing Magic: The Gathering decks within the application. This view allows users to search for cards, add/remove them to a deck, manage deck details (name, format), receive real-time validation feedback, and save their progress. It integrates with the backend API to fetch card data and persist deck information.

## 2. View Routing

The Deck Builder view will be accessible at the application's root path:
- **Path:** `/`
- It should also handle loading existing decks, potentially using a route like `/decks/:deckId`, which would resolve to this view component but trigger loading data for the specified deck ID.

## 3. Component Structure

The view will be composed of several Angular Material components, structured hierarchically:

```
DeckBuilderViewComponent (Container/View - Handles State/Logic)
├── DeckHeaderComponent (Presentational - Deck Name, Format, Validity, Actions)
│   └── DeckValidityBadgeComponent (Implicitly part of Header - Displays Icon/Tooltip)
├── DeckSummaryComponent (Presentational - Displays grouped deck cards)
│   └── CardGroupComponent[] (Presentational - Represents one type group)
│       └── CardItemComponent[] (Presentational - Represents one card entry in group)
│           └── CardImagePopoverDirective (Attribute Directive - Shows image on hover)
├── CardSearchFilterComponent (Presentational - UI for filtering card table)
└── CardTableComponent (Presentational - Displays filterable/sortable/paginated cards)
    └── (Uses MatTable, MatPaginator, MatSort)
    └── (Optionally uses CardImagePopoverDirective on card names in table)
```

## 4. Component Details

### `DeckBuilderViewComponent`
- **Description:** The main smart container component for the view. Orchestrates interactions between child components, connects to the ngrx store to select state and dispatch actions. Handles route parameters for loading existing decks.
- **Core Elements:** Angular component structure (`<app-deck-header>`, `<app-deck-summary>`, `<app-card-search-filter>`, `<app-card-table>`), async pipes for observables.
- **Handled Interactions:** Listens to outputs from child components (`saveClicked`, `newClicked`, `filtersChanged`, `pageChanged`, `sortChanged`, `addCard`, `removeCard`) and dispatches corresponding ngrx actions (`saveDeck`, `createNewDeck`, `updateCardListFilters`, etc.). Initiates deck loading based on route parameters (`loadDeck`).
- **Validation:** Selects validation status (`isValid`, `validationMessages`) from the ngrx store and passes it down to `DeckHeaderComponent`.
- **Types:** `Observable<DeckState>`, `Observable<CardListState>`, `Observable<boolean>` (loading states), `Observable<string | null>` (error states).
- **Properties:** N/A (Top-level view component).

### `DeckHeaderComponent`
- **Description:** Displays the deck's metadata (name, format), validity status, and action buttons (Save, New). Allows editing the deck name.
- **Core Elements:** `mat-form-field` for deck name input, `mat-select` for format (disabled options), custom `DeckValidityBadgeComponent` (or simple `mat-icon` with `matTooltip`), `mat-button` for actions.
- **Handled Interactions:** Emits events: `deckNameChanged(string)`, `saveClicked()`, `newClicked()`.
- **Validation:** Displays validation status via the badge and tooltip based on input props.
- **Types:** Uses `DeckMetadata`, `DeckValidity` interfaces for input.
- **Properties:**
    - `@Input() metadata: DeckMetadata`
    - `@Input() validity: DeckValidity`
    - `@Input() isSaving: boolean` (To disable Save button during save)

### `DeckSummaryComponent`
- **Description:** Displays the list of cards currently added to the deck, grouped by card type (Creature, Land, etc.) with counts for each group and total count. Allows card removal.
- **Core Elements:** Sections/divs for each group, potentially using `*ngFor` over grouped data. Uses `CardGroupComponent`. Includes total card count display.
- **Handled Interactions:** Bubbles up `removeCard(DeckCard)` event from child components.
- **Validation:** N/A (Displays current state).
- **Types:** Expects grouped deck data, e.g., `Map<string, DeckCard[]>`, `DeckCard[]`.
- **Properties:**
    - `@Input() groupedCards: Map<string, DeckCard[]>`
    - `@Input() totalCardCount: number`

### `CardGroupComponent`
- **Description:** Renders a single group section within the `DeckSummaryComponent` (e.g., "Creatures (20)"). Lists individual cards using `CardItemComponent`.
- **Core Elements:** Header (e.g., `<h4>`) for group name and count, `*ngFor` to loop over `CardItemComponent`.
- **Handled Interactions:** Bubbles up `removeCard(DeckCard)` event.
- **Validation:** N/A.
- **Types:** Uses `DeckCard[]`.
- **Properties:**
    - `@Input() groupName: string`
    *   `@Input() groupCount: number`
    *   `@Input() cards: DeckCard[]`

### `CardItemComponent`
- **Description:** Displays a single card entry within a group, showing name, mana cost, quantity, and a remove button/icon. Applies the `CardImagePopoverDirective`.
- **Core Elements:** `div` or `mat-list-item`, spans for details, `mat-icon-button` for removal. Uses `appCardImagePopover` directive.
- **Handled Interactions:** Emits `removeClicked(DeckCard)`, potentially `cardHovered(Card)` (though popover might handle this internally).
- **Validation:** N/A.
- **Types:** Uses `DeckCard`.
- **Properties:**
    - `@Input() deckCard: DeckCard`

### `CardImagePopoverDirective`
- **Description:** An attribute directive applied to elements (like card names). On hover, it displays an Angular Material CDK Overlay containing the card's image (`imageUrl`).
- **Core Elements:** Uses Angular CDK Overlay (`OverlayModule`) to create and manage the popover.
- **Handled Interactions:** Internal hover listeners (`HostListener`).
- **Validation:** N/A.
- **Types:** Expects card data containing `imageUrl`.
- **Properties:**
    - `@Input('appCardImagePopover') card: Card`

### `CardSearchFilterComponent`
- **Description:** Provides UI controls for filtering the `CardTableComponent`. Includes inputs/selects for name, set, rarity, color, type, and mana cost.
- **Core Elements:** `mat-form-field`, `mat-input`, `mat-select` (multiple for rarity/color/type), `mat-checkbox` (for color?), potentially `mat-slider` for mana cost. A "Apply Filters" button or filters apply on change (debounced).
- **Handled Interactions:** Emits `filtersChanged(CardFilters)`.
- **Validation:** Optional basic input validation (e.g., numeric mana cost).
- **Types:** Uses `CardFilters`.
- **Properties:**
    - `@Input() currentFilters: CardFilters` (To initialize controls)

### `CardTableComponent`
- **Description:** Displays the available MTG cards fetched from the API in a paginated and sortable `mat-table`. Each row includes card details and an 'Add' button.
- **Core Elements:** `mat-table`, `mat-sort`, `mat-paginator`. `*matHeaderRowDef`, `*matRowDef`, `mat-cell`, `mat-header-cell`. 'Add' button (`mat-button` or `mat-icon-button`) in a column.
- **Handled Interactions:** Emits `addCard(Card)`, `pageChanged(PageEvent)`, `sortChanged(Sort)`.
- **Validation:** N/A.
- **Types:** Uses `Card[]`, `PaginationState`, `SortState`.
- **Properties:**
    - `@Input() cards: Card[]`
    - `@Input() pagination: PaginationState`
    - `@Input() sort: SortState`
    - `@Input() isLoading: boolean` (To show loading indicator)

## 5. Types (Frontend Interfaces)

```typescript
// Represents a single MTG card definition
interface Card {
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
  // Potentially add fields for double-faced cards if needed, like 'cardFaces'
  // Add other fields from API response as necessary for display/filtering
}

// Represents a card entry within the deck state
interface DeckCard {
  card: Card;
  quantity: number;
}

// Ngrx state slice for the currently edited deck
interface DeckState {
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
interface CardListState {
  cards: Card[];
  pagination: PaginationState;
  sort: SortState;
  filters: CardFilters;
  isLoading: boolean;
  error: string | null;
}

// Pagination state (aligned with MatPaginator)
interface PaginationState {
  pageIndex: number; // 0-based
  pageSize: number;
  totalItems: number;
}

// Sorting state (aligned with MatSort)
interface SortState {
  active: string; // Column name
  direction: 'asc' | 'desc' | '';
}

// Filters for the card list
interface CardFilters {
  name: string | null;
  set: string | null;
  rarity: string[] | null; // Allow multiple
  color: string[] | null; // Allow multiple
  type: string[] | null; // Allow multiple
  manaCost: number | null; // Or range? Keep simple first.
}

// Input type for DeckHeaderComponent
interface DeckMetadata {
  id: number | null;
  name: string;
  format: string;
}

// Input type for DeckHeaderComponent (validity part)
interface DeckValidity {
  isValid: boolean;
  messages: string[];
}

// ---- Request DTOs (match api-plan.md structure) ----

// Represents a card within a deck for save requests
interface DeckCardRequestDto {
  quantity: number;
  card: Card; // Send full card details as per api-plan example
              // Alternative: Backend might only need apiId, clarify if possible. Assuming full obj for now.
}

// Payload for POST /decks
interface CreateDeckRequestDto {
  deckName: string;
  deckFormat: string; // "Standard" initially
  deckDescription: string | null;
  cards: DeckCardRequestDto[];
}

// Payload for PUT /decks/{deckId}
interface UpdateDeckRequestDto {
  deckName: string;
  deckDescription: string | null;
  // format is likely not updatable? Confirm if needed.
  cards: DeckCardRequestDto[]; // Complete list replaces the old one
}

// ---- Response DTOs (mapping from api-plan.md) ----
// Assumed based on api-plan, align with actual backend implementation

interface CardListResponseDto {
    cards: Card[];
    pagination: {
        page: number; // 1-based from API
        pageSize: number;
        totalPages: number;
        totalRecords: number;
    };
}

interface DeckDto { // Basic deck info
    id: number;
    deckName: string;
    deckFormat: string;
    deckDescription: string | null;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
}

interface DeckStatisticsDto {
    totalCards: number;
    types: { [key: string]: number }; // e.g., { "Creature": 40, ... }
    manaCurve: { [key: string]: number }; // e.g., { "1": 5, "2": 10, ... }
    colors: { [key: string]: number }; // e.g., { "White": 30, ... }
}

// For GET /decks/{deckId} response
interface DeckDetailsDto {
    id: number; // Duplicated from DeckDto, maybe flatten? Check API response. Assuming structure from api-plan.
    deckName: string;
    deckFormat: string;
    deckDescription: string | null;
    createdAt: string;
    updatedAt: string;
    cards: DeckCardRequestDto[]; // API plan shows this structure for GET response too
    statistics: DeckStatisticsDto;
}

```

## 6. State Management (ngrx)

State will be managed using ngrx, with two primary feature slices: `deck` and `cardList`.

-   **`deck` Slice (`DeckState`):**
    -   Holds the complete state of the deck being currently edited (ID, name, format, description, cards list, validation status, loading/saving flags, errors).
    *   Managed by `deckReducer`.
    *   Actions like `addCardToDeck`, `removeCardFromDeck`, `updateDeckName`, `loadDeckSuccess`, `saveDeck`, `saveDeckSuccess`, `createNewDeck`, `validateDeck` update this state.
    *   The `cards` array will be a flat list (`DeckCard[]`) for easier updates in the reducer.
    *   Validation (`isValid`, `validationMessages`) will be calculated within the reducer or a dedicated selector whenever the `cards` array changes (triggered by `validateDeck` action).
-   **`cardList` Slice (`CardListState`):**
    *   Holds the state related to fetching and displaying available cards (list of `Card` objects, current filters, pagination, sorting, loading flag, errors).
    *   Managed by `cardListReducer`.
    *   Actions like `loadCards`, `loadCardsSuccess`, `updateCardListFilters`, `updateCardListPage`, `updateCardListSort` update this state.
-   **Effects:**
    -   `DeckEffects`: Handles asynchronous operations for loading (`GET /decks/{deckId}`) and saving (`POST /decks`, `PUT /decks/{deckId}`) the deck. Dispatches success/failure actions. Triggers validation action on relevant changes.
    -   `CardListEffects`: Handles the `GET /cards` API call based on filter/pagination/sort state changes. Includes debouncing for filter updates to avoid excessive API calls.
-   **Selectors:**
    -   Provide memoized access to specific parts of the state (e.g., `selectCurrentDeck`, `selectDeckCards`, `selectDeckValidity`, `selectAvailableCards`, `selectCardListPagination`, `selectGroupedDeckCards`).
    -   `selectGroupedDeckCards`: A crucial selector that transforms the flat `deck.cards` list into a `Map<string, DeckCard[]>` grouped by card type (Creature, Land, etc.) for the `DeckSummaryComponent`.

## 7. API Integration

Integration relies on Angular's `HttpClient` module and ngrx effects.

-   **Authentication:** An `HttpInterceptor` should be implemented to automatically attach the JWT Bearer token (obtained after Cognito login) to the `Authorization` header for all requests to `/decks` endpoints.
-   **`GET /cards`:**
    -   Called by `CardListEffects` in response to `loadCards` action.
    -   Parameters (`page`, `pageSize`, `sort`, `order`, filters like `set`, `name`, `type`, etc.) are constructed from the `CardListState`. Note API page is 1-based, `MatPaginator` is 0-based - adjust accordingly.
    -   Response `CardListResponseDto` is mapped to update `CardListState` via `loadCardsSuccess`. Error handled via `loadCardsFailure`.
-   **`POST /decks`:**
    -   Called by `DeckEffects` when `saveDeck` is dispatched and `deck.id` is null.
    -   Payload `CreateDeckRequestDto` is constructed from `DeckState`.
    -   Response (likely minimal, maybe the new `DeckDto`) updates `DeckState` (sets `id`) via `saveDeckSuccess`. Error handled via `saveDeckFailure`.
-   **`PUT /decks/{deckId}`:**
    -   Called by `DeckEffects` when `saveDeck` is dispatched and `deck.id` exists.
    -   Payload `UpdateDeckRequestDto` is constructed from `DeckState`. Deck ID is passed in the URL.
    -   Response (likely minimal) handled via `saveDeckSuccess`. Error handled via `saveDeckFailure`.
-   **`GET /decks/{deckId}`:**
    -   Called by `DeckEffects` when `loadDeck` is dispatched (e.g., on route activation).
    *   Response `DeckDetailsDto` is mapped to update `DeckState` via `loadDeckSuccess`. Error handled via `loadDeckFailure`.

## 8. User Interactions

-   **Editing Deck Name:** User types in input -> `DeckHeaderComponent` emits `deckNameChanged` -> View dispatches `updateDeckName` -> Reducer updates state.
-   **Saving Deck:** User clicks 'Save' -> `DeckHeaderComponent` emits `saveClicked` -> View dispatches `saveDeck` -> Effect calls API -> Reducer updates saving state -> Snackbar confirmation/error on completion.
-   **Starting New Deck:** User clicks 'New' -> `DeckHeaderComponent` emits `newClicked` -> View dispatches `createNewDeck` -> Reducer resets `deck` state.
-   **Filtering Cards:** User changes filter controls -> `CardSearchFilterComponent` emits `filtersChanged` -> View dispatches `updateCardListFilters` -> Effect debounces -> Effect dispatches `loadCards`.
-   **Paginating/Sorting Cards:** User interacts with `MatPaginator`/`MatSort` -> `CardTableComponent` emits `pageChanged`/`sortChanged` -> View dispatches `updateCardListPage`/`updateCardListSort` -> Effect dispatches `loadCards`.
-   **Adding Card:** User clicks 'Add' on table row -> `CardTableComponent` emits `addCard` -> View dispatches `addCardToDeck` -> Reducer updates `deck.cards` -> Reducer/Selector recalculates validation.
-   **Removing Card:** User clicks 'Remove' icon on card item -> `CardItemComponent` emits `removeClicked` -> Bubbles up -> View dispatches `removeCardFromDeck` or `decrementCardQuantity` -> Reducer updates `deck.cards` -> Reducer/Selector recalculates validation.
-   **Viewing Card Image:** User hovers over card name -> `CardImagePopoverDirective` displays image fetched from `card.imageUrl`.

## 9. Conditions and Validation

-   **Deck Validity Rules (Real-time):**
    -   Minimum 60 cards total.
    -   Maximum 4 copies of any card *unless* its type includes "Land".
    -   **Implementation:** Calculated in `deckReducer` or a selector whenever `deck.cards` changes. Updates `deck.isValid` and `deck.validationMessages`.
    -   **UI Feedback:** `DeckHeaderComponent` displays a badge (e.g., green check / red warning icon) and provides detailed messages in a `matTooltip` attached to the badge. The 'Save' button could potentially be disabled if `!isValid`.
-   **API Payload Validation:** Backend performs final validation on `POST/PUT /decks`. Frontend should handle potential 400 Bad Request errors resulting from this.
-   **Input Validation:** Basic validation on filter inputs if necessary (e.g., mana cost is numeric).

## 10. Error Handling

-   **API Errors (`GET /cards`, `GET/POST/PUT /decks`):**
    -   Handled in ngrx Effects (`catchError` operator).
    -   Dispatch specific failure actions (e.g., `loadCardsFailure`, `saveDeckFailure`).
    -   Reducers update `error` property in the relevant state slice and set loading flags to false.
    -   Components select the error state and display user-friendly messages, typically using `MatSnackBar`. For critical load errors (`GET /cards`, `GET /decks/{deckId}`), an inline error message might be more appropriate.
-   **Network Errors:** Handled similarly via Effect error catching. Provide generic "Network error" message.
-   **Authentication Errors (401):** An `HttpInterceptor` should ideally catch 401s, potentially attempt a token refresh (if using refresh tokens) or redirect to the login page.
-   **Validation Errors (400 from Save):** Display specific error messages from the backend response if available, otherwise a generic "Validation failed" message via Snackbar.

## 11. Implementation Steps

1.  **Setup:** Create the feature module (`DeckBuilderModule`?), configure routing (`/`, `/decks/:deckId`). Set up ngrx store, install dependencies (`@ngrx/store`, `@ngrx/effects`, `@ngrx/entity` if needed).
2.  **State:** Define ngrx state interfaces (`DeckState`, `CardListState`, supporting types). Implement actions, reducers, and basic selectors for both slices.
3.  **API Service:** Create an Angular service (`DeckService`, `CardService`?) responsible for making HTTP calls defined in the API plan.
4.  **Effects:** Implement `DeckEffects` and `CardListEffects` to handle API calls triggered by actions.
5.  **Core Components:** Create skeleton components (`.ts`, `.html`, `.scss`) for `DeckBuilderViewComponent`, `DeckHeaderComponent`, `DeckSummaryComponent`, `CardSearchFilterComponent`, `CardTableComponent`, `CardGroupComponent`, `CardItemComponent`.
6.  **Card Table Implementation (`CardTableComponent`, `CardSearchFilterComponent`):**
    *   Build `mat-table` with required columns, sorting (`matSort`), pagination (`mat-paginator`).
    *   Implement filter controls (`CardSearchFilterComponent`).
    *   Connect table and filters to `cardList` state via `DeckBuilderViewComponent` (dispatch actions on interaction, select state for display).
    *   Implement `GET /cards` call via ngrx. Add 'Add' button functionality (dispatch `addCardToDeck`).
7.  **Deck Summary Implementation (`DeckSummaryComponent`, `CardGroupComponent`, `CardItemComponent`):**
    *   Connect to `deck` state via `DeckBuilderViewComponent`.
    *   Use `selectGroupedDeckCards` selector to get data in the required format.
    *   Implement display logic for groups and items.
    *   Add 'Remove' button functionality (dispatch `removeCardFromDeck`/`decrementCardQuantity`).
8.  **Deck Header Implementation (`DeckHeaderComponent`):**
    *   Connect to `deck` state (name, format, validity, saving status).
    *   Implement deck name editing (dispatch `updateDeckName`).
    *   Implement 'Save' and 'New' button actions (dispatch `saveDeck`, `createNewDeck`).
    *   Implement validity badge display.
9.  **Validation Logic:** Implement the deck validation logic within the `deckReducer` or relevant selector, updating `isValid` and `validationMessages` in the state.
10. **Saving/Loading Logic:** Implement `saveDeck` and `loadDeck` effects, including API calls (`POST/PUT /decks`, `GET /decks/{deckId}`) and state updates. Handle routing for loading decks.
11. **Image Popover:** Implement `CardImagePopoverDirective` using CDK Overlay and apply it in `CardItemComponent` (and potentially `CardTableComponent`).
12. **Error Handling:** Implement Snackbar displays for API errors based on error state selected from the store. Enhance HTTP interceptor if needed.
13. **Styling & Responsiveness:** Apply styles using SCSS, leverage Angular Material themes and Flex Layout/CSS Grid for responsive design.
14. **Testing:** Add unit tests for components, reducers, effects, and selectors. Consider integration tests for key user flows.
15. **Refinement:** Polish UI/UX, address accessibility concerns (ARIA labels, keyboard navigation).

``` 