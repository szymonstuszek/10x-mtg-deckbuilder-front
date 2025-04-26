# Decks View Implementation Plan

## 1. Overview

This document outlines the implementation plan for the "Decks View". This view serves as the user's dashboard for managing their saved Magic: The Gathering decks. It displays a list of created decks, provides options to edit or delete them, and allows navigation back to the Deck Builder view to modify a selected deck.

## 2. View Routing

The Decks View will be accessible at the following path:
- **Path:** `/decks`
- It will be protected by an authentication guard, ensuring only logged-in users can access it.

## 3. Component Structure

The view will primarily consist of a smart container component managing state and interaction, and a presentational component for displaying each deck.

```
DecksViewComponent (Container/View - Handles State/Logic)
├── LoadingIndicatorComponent (Presentational - Shown during data fetch)
├── ErrorMessageComponent (Presentational - Shown on API errors)
├── EmptyStateComponent (Presentational - Shown if no decks exist)
└── GridContainer (Layout Element)
    └── DeckCardComponent[] (Presentational - Displays one deck card)
        └── (Uses MatCard, MatButton, MatIcon)
        └── (Triggers actions via @Output)

(Dialogs)
└── ConfirmDialogComponent (Presentational - Opened via MatDialog for delete confirmation)
```

## 4. Component Details

### `DecksViewComponent`
- **Description:** The main smart container component for the `/decks` route. It fetches the list of user decks, manages loading and error states using ngrx, handles user actions (edit, delete), interacts with the confirmation dialog, and renders the appropriate child components (`DeckCardComponent`, loading/error/empty states).
- **Core Elements:** Uses `*ngIf` directives to conditionally display loading indicators, error messages, empty state messages, or the grid of `DeckCardComponent` instances based on the ngrx state. Uses Angular Material's `MatDialog` service to open the `ConfirmDialogComponent`. Contains the grid layout structure (e.g., using CSS Grid or Flexbox).
- **Handled Interactions:**
    - Dispatches `loadDecks` action on initialization (`ngOnInit`).
    - Listens to `editClicked(deckId)` output from `DeckCardComponent` and dispatches `navigateToEditDeck({ deckId })`.
    - Listens to `deleteClicked(deckId)` output from `DeckCardComponent`, opens the `ConfirmDialogComponent`, and dispatches `deleteDeck({ deckId })` if confirmed.
    - Selects `decks`, `isLoading`, `error` from the ngrx store using selectors.
- **Validation:** Handles the confirmation step for deletion.
- **Types:** `Observable<DeckMeta[]>`, `Observable<boolean>`, `Observable<string | null>`, `MatDialog`. Uses `DecksState` selectors.
- **Properties:** N/A (Top-level view component for the route).

### `DeckCardComponent`
- **Description:** A presentational component responsible for rendering a single deck card within the grid. Displays the deck's name, a representative image, and buttons for editing and deleting the deck.
- **Core Elements:** Uses `mat-card` as the main container. Displays `deck.deckName`. Uses `<img>` tag for `deck.representativeImageUrl`. Includes `mat-card-actions` with two `mat-button` or `mat-icon-button` elements for 'Edit' and 'Delete'.
- **Handled Interactions:**
    - Emits `editClicked(deckId: number)` when the edit button is clicked.
    - Emits `deleteClicked(deckId: number)` when the delete button is clicked.
- **Validation:** None.
- **Types:** Uses `DeckMeta` interface for input.
- **Properties:**
    - `@Input() deck: DeckMeta`

### `ConfirmDialogComponent` (Assumed Shared Component)
- **Description:** A reusable presentational component displayed as a modal dialog to confirm potentially destructive actions.
- **Core Elements:** Uses `MatDialogModule` components (`mat-dialog-title`, `mat-dialog-content`, `mat-dialog-actions`). Displays a title (e.g., "Confirm Deletion") and message (e.g., "Are you sure you want to delete this deck?"). Provides 'Confirm' and 'Cancel' buttons.
- **Handled Interactions:** Returns `true` via `dialogRef.close(true)` on Confirm, `false` or `undefined` on Cancel/Close.
- **Validation:** None.
- **Types:** Receives configuration data via `MAT_DIALOG_DATA` (e.g., `{ title: string, message: string }`). Returns `boolean`.
- **Properties:** N/A (Instantiated via `MatDialog`).

## 5. Types (Frontend Interfaces)

```typescript
// Represents the data needed to display a single deck card in the list
// Combines backend DeckDto with the fetched representative image URL
interface DeckMeta {
  id: number;
  deckName: string;
  // deckFormat: string; // Likely not needed for card display
  // deckDescription: string | null; // Likely not needed for card display
  // createdAt: string; // Optional: Could be displayed if needed
  // updatedAt: string; // Optional: Could be displayed if needed
  representativeImageUrl: string | null; // Fetched via GET /decks/{deckId}/random
}

// Ngrx state slice for the Decks feature
interface DecksState {
  decks: DeckMeta[];      // List of decks to display
  isLoading: boolean;     // True while fetching or deleting
  error: string | null;   // Holds API error messages
}

// Interface for the data returned by GET /decks/{deckId}/random API endpoint
// Based on backend RandomCardResponseDto structure
interface RandomCardResponse {
  card: {
      // Include fields necessary to get the image URL, e.g.:
      imageUrl: string | null;
      // Other card fields might be present but aren't strictly needed here
  } | null; // Allow null if API returns no card
}

// Basic structure expected from the GET /decks API endpoint response items
// Based on backend DeckDto structure (snake_case might need mapping)
interface BackendDeckDto {
  id: number;
  deck_name: string; // Or deckName if backend uses camelCase
  deck_format: string;
  deck_description: string | null;
  created_at: string;
  updated_at: string;
}

// Re-use existing Card interface if needed (primarily for RandomCardResponse)
interface Card {
  apiId: string;
  name: string;
  manaCost: string | null;
  cmc: number;
  colors: string[] | null;
  colorIdentity: string[] | null;
  type: string;
  types: string[];
  subtypes: string[] | null;
  rarity: string;
  set: string;
  setName: string;
  text: string | null;
  artist: string | null;
  number: string | null;
  power: string | null;
  toughness: string | null;
  layout: string;
  imageUrl: string | null;
}
```

## 6. State Management (ngrx)

State for this view will be managed within a dedicated ngrx feature slice, potentially named `decks`.

-   **State Slice (`DecksState`):**
    -   `decks: DeckMeta[]`: Holds the array of decks fetched from the API, formatted for display.
    *   `isLoading: boolean`: Indicates if data is currently being fetched (`GET /decks`, `GET /.../random`) or if a delete operation (`DELETE /decks/{deckId}`) is in progress. Used to show loading indicators.
    *   `error: string | null`: Stores error messages from API failures, allowing the UI to display feedback.
-   **Actions:**
    *   `[Decks View] Load Decks`: Triggered by `DecksViewComponent` on initialization.
    *   `[Decks API] Load Decks Success { decks: DeckMeta[] }`: Dispatched by effects upon successful retrieval and processing of decks and their images.
    *   `[Decks API] Load Decks Failure { error: string }`: Dispatched by effects if fetching decks or images fails.
    *   `[Decks View] Delete Deck { deckId: number }`: Triggered after user confirmation in the dialog.
    *   `[Decks API] Delete Deck Success { deckId: number }`: Dispatched by effects on successful deletion.
    *   `[Decks API] Delete Deck Failure { error: string }`: Dispatched by effects if deletion fails.
    *   `[Decks View] Navigate To Edit Deck { deckId: number }`: Triggered when the user clicks the 'Edit' button. This might trigger effects related to the *Deck Builder's* state.
-   **Reducers:**
    *   Handle `Load Decks`: Set `isLoading` to true, clear previous `error`.
    *   Handle `Load Decks Success`: Set `isLoading` to false, store `decks`, clear `error`.
    *   Handle `Load Decks Failure`: Set `isLoading` to false, store `error`.
    *   Handle `Delete Deck`: Set `isLoading` to true (or a specific deleting flag if needed), clear `error`.
    *   Handle `Delete Deck Success`: Set `isLoading` to false, remove the deck with `deckId` from the `decks` array, clear `error`.
    *   Handle `Delete Deck Failure`: Set `isLoading` to false, store `error`.
-   **Effects:**
    -   `LoadDecksEffect`:
        -   Listens for `Load Decks` action.
        -   Calls the service method to fetch `GET /decks`.
        -   On success, for each `BackendDeckDto` received:
            -   Calls the service method to fetch `GET /decks/{deckId}/random`.
            -   Maps the `BackendDeckDto` and the `RandomCardResponse` to a `DeckMeta` object. (Consider using `forkJoin` or `mergeMap` for concurrent image fetching).
        -   Dispatches `Load Decks Success` with the resulting `DeckMeta[]`.
        -   Catches errors and dispatches `Load Decks Failure`.
    -   `DeleteDeckEffect`:
        -   Listens for `Delete Deck` action.
        -   Calls the service method to perform `DELETE /decks/{deckId}`.
        -   Dispatches `Delete Deck Success` with the `deckId`.
        -   Catches errors and dispatches `Delete Deck Failure`.
    -   `NavigateToEditEffect`:
        -   Listens for `Navigate To Edit Deck` action.
        -   Dispatches an action to load the specific deck into the *Deck Builder's* state slice (e.g., `[Deck Builder] Load Deck { deckId }`). This assumes the Deck Builder has its own ngrx state management.
        -   Uses Angular's `Router` to navigate to `/` (the Deck Builder view).
-   **Selectors:**
    -   `selectDecksList`: Returns `state.decks`.
    -   `selectDecksLoading`: Returns `state.isLoading`.
    -   `selectDecksError`: Returns `state.error`.

## 7. API Integration

Integration relies on Angular's `HttpClient` module, likely abstracted into an `DeckService`, and managed via ngrx effects.

-   **Authentication:** Assumes an `HttpInterceptor` attaches the necessary JWT Bearer token to all requests targeting the `/decks` endpoints.
-   **`GET /decks`:**
    -   Called by `LoadDecksEffect` in response to `Load Decks` action.
    -   Maps the `BackendDeckDto[]` response. Used as input for fetching random images.
-   **`GET /decks/{deckId}/random`:**
    -   Called by `LoadDecksEffect` for each deck ID obtained from `GET /decks`.
    -   The `imageUrl` from the nested `card` object in the `RandomCardResponse` is extracted and mapped to `DeckMeta.representativeImageUrl`. Handles cases where `card` or `imageUrl` might be null.
-   **`DELETE /decks/{deckId}`:**
    -   Called by `DeleteDeckEffect` in response to `Delete Deck` action.
    -   The `deckId` is passed in the URL.
    -   Success triggers `Delete Deck Success`, failure triggers `Delete Deck Failure`.
-   **`GET /decks/{deckId}` (Implicit for Edit):**
    -   While not called directly *by* this view's effects, the `NavigateToEditEffect` triggers loading this data within the Deck Builder's feature state before navigation.

## 8. User Interactions

-   **Load View:** User navigates to `/decks` -> `DecksViewComponent` initializes -> Dispatches `Load Decks` -> Loading indicator shown -> Effects fetch data -> State updates -> Grid of `DeckCardComponent`s is displayed (or empty/error state).
-   **Click Edit Button:** User clicks 'Edit' on a `DeckCardComponent` -> `editClicked` event emitted -> `DecksViewComponent` catches event -> Dispatches `Navigate To Edit Deck` -> Effect triggers Deck Builder state load -> Router navigates to `/`.
-   **Click Delete Button:** User clicks 'Delete' on a `DeckCardComponent` -> `deleteClicked` event emitted -> `DecksViewComponent` catches event -> Opens `ConfirmDialogComponent`.
-   **Confirm Deletion:** User clicks 'Confirm' in dialog -> Dialog closes returning `true` -> `DecksViewComponent` dispatches `Delete Deck` -> Loading state potentially shown -> Effect calls API -> State updates -> Deck removed from grid on success / Error shown on failure.
-   **Cancel Deletion:** User clicks 'Cancel' or closes dialog -> Dialog closes returning `false`/`undefined` -> `DecksViewComponent` takes no further delete action.

## 9. Conditions and Validation

-   **Authentication:** The route `/decks` should be protected by an `AuthGuard` ensuring only authenticated users can access it.
-   **Delete Confirmation:** Deletion requires explicit user confirmation via the `ConfirmDialogComponent` before the `DELETE` API call is made. This is handled within the `DecksViewComponent`.
-   **Data Ownership:** The backend API is responsible for ensuring users can only view and delete their own decks. The frontend relies on the API for this authorization.

## 10. Error Handling

-   **API Errors (`GET /decks`, `GET /.../random`, `DELETE /decks/{deckId}`):**
    -   Caught within ngrx Effects using `catchError`.
    -   Dispatch corresponding failure actions (`Load Decks Failure`, `Delete Deck Failure`) containing the error message.
    -   Reducers update the `error` property in `DecksState` and set `isLoading` to `false`.
    -   `DecksViewComponent` selects the `error` state. A general error message can be displayed if `Load Decks Failure` occurs.
    -   A global error handling mechanism (e.g., a root effect listening for specific failure actions or an `HttpInterceptor`) should display user-friendly messages (e.g., using `MatSnackBar`), especially for transient errors like delete failures.
-   **Network Errors:** Handled similarly by effects' `catchError`, potentially dispatching generic failure actions or specific network error actions. Display a generic "Network error" message.
-   **Authentication Errors (401/403):** Primarily handled by a global `HttpInterceptor`, which should redirect the user to the login page.
-   **Not Found Errors (404 on Delete):** Handled as a specific failure case. Inform the user via Snackbar that the deck might have already been deleted.

## 11. Implementation Steps

1.  **Setup:** Create a new Angular feature module (e.g., `DecksModule`) and configure routing for `/decks`. Ensure `AuthGuard` is applied.
2.  **State:** Define `DecksState`, actions, reducers, and selectors within an ngrx feature slice (`decks`).
3.  **Service:** Create or update an `DeckService` with methods for `getDecks()`, `getRandomCardImage(deckId)`, and `deleteDeck(deckId)`.
4.  **Effects:** Implement `LoadDecksEffect`, `DeleteDeckEffect`, and `NavigateToEditEffect`. Ensure proper handling of API calls, data mapping (including fetching random images), and dispatching success/failure actions. Handle potential backend snake_case to frontend camelCase mapping if necessary.
5.  **Components:** Create `DecksViewComponent` and `DeckCardComponent` (`.ts`, `.html`, `.scss`). Implement the basic structure and styling using Angular Material (`mat-card`, `mat-button`, etc.). Create or ensure availability of a shared `ConfirmDialogComponent`.
6.  **View Component Logic (`DecksViewComponent`):**
    *   Inject necessary services (`Store`, `MatDialog`, `Router`).
    *   Select state observables (`decks$`, `isLoading$`, `error$`).
    *   Dispatch `Load Decks` in `ngOnInit`.
    *   Implement template logic (`*ngIf`) for loading, error, empty, and data states.
    *   Implement grid layout for deck cards.
    *   Implement handler methods for `editClicked` and `deleteClicked` outputs, including dialog interaction and action dispatching.
7.  **Card Component Logic (`DeckCardComponent`):**
    *   Define `@Input() deck: DeckMeta`.
    *   Define `@Output() editClicked` and `@Output() deleteClicked` event emitters.
    *   Implement the template to display `deck.deckName`, `deck.representativeImageUrl`, and action buttons triggering the outputs.
8.  **Dialog Integration:** Implement the logic in `DecksViewComponent` to open the `ConfirmDialogComponent` using `MatDialog` and handle its result.
9.  **Navigation:** Ensure the `NavigateToEditEffect` correctly dispatches the action to load the deck in the Deck Builder's state and navigates to `/`.
10. **Error Handling:** Connect error state to UI display (inline message for load errors) and ensure global Snackbar handler is triggered for appropriate failures (e.g., delete failure).
11. **Styling & Responsiveness:** Apply styles using SCSS. Ensure the grid layout is responsive using CSS Grid/Flexbox or `MatGridList`.
12. **Testing:** Add unit tests for components, reducers, effects, and selectors. Consider integration tests for the load-display-delete flow.
13. **Refinement:** Polish UI/UX, check accessibility (ARIA labels, keyboard navigation).
