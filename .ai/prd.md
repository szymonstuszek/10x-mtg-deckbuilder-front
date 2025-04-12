# Product Requirements Document (PRD) - mtg-deck-builder

## 1. Product Overview
The 10x-mtg-deck-builder application is designed to provide Magic: The Gathering players with a digital platform to efficiently build and manage their decks. The app aims to eliminate the inefficiencies of traditional paper-based deck tracking by offering a dynamic, responsive interface powered by Angular and Angular Material. This tool is intended primarily for casual players who require a simple, real-time deck-building experience, allowing rapid access to card information and streamlined deck composition.

## 2. User Problem
Players of Magic: The Gathering often face the tedious task of manually recording deck lists, which is time-consuming and prone to errors. The core user problem is the inconvenience of managing multiple decks on paper. Users need an efficient, digital solution that:
- Provides quick access to a comprehensive library of cards across various expansions.
- Allows easy filtering and sorting of cards by various criteria (e.g., expansion, rarity, mana cost, color, card type).
- Offers instant feedback on deck composition to ensure compliance with game rules.

## 3. Functional Requirements
1. **Card Display and Navigation**
   - Display Mtg cards in a paginated table with 50 cards per page.
   - Enable sorting by clicking on table column headers.
   - Provide an option to display cards from a specific set in the table.
   - Provide filtering options based on rarity, mana cost, color, and card type.
   - Provide a search option on the table based on card name.
   - On selection, display full card details including name, mana cost, image, and description, consider that some cards are double-side: they have a front and back.
   - there is an option in the table to add the selected card to the current deck

2. **Deck Building**
   - Implement a two-panel interface:
     - Top panel: Deck-building table displaying the current deck.
        - sections informing about the current number of cards
        - button that will navigate to a view with the deck details
        - dropdown with the deck format: as a starting point, there will be only 1 option: Standard
     - Bottom panel: Card selection table showing available cards.
   - Allow immediate addition of cards from the selection table to the deck.
   - Support instantaneous card removal from the deck.
   - Enforce deck validation rules in real time:
     - A standard deck must contain a minimum of 60 cards.
     - No more than 4 copies of any non-land card are allowed.
     - Validation rules should be generic - future versions of the application might support other formats, which would have different rules.
   - Provide visual validation feedback.

3. **Deck Details**
   - Separate screen displaying a table with the list of cards from the deck
   - Shows details about the decks:
     - number of cards of different types: creatures, sorceries, instants etc
     - mana curve of the deck: listing of cards of 1 mana cost, 2 mana cost, etc. include information about the colors

4. **Deck Management**
   - Offer functionality to save decklists.
   - Display saved decks along with deck statistics such as the number of cards, card types, mana curve, deck name, and visual indicators of deck colors.
   - Include a feature to show a random non-land card from the deck, when displaying the decklists.

5. **Responsiveness**
   - Ensure the application displays optimally on both computer screens and mobile devices.

6. **Basic security features**.**
   - User registration and authentication.
   - Users can only manage their own decklists, they can not see decklists of other users.

7. **Data persitance**
   - Decks that users save should be persisted in a database.

## 4. Product Boundaries
- **Inclusions (MVP):**
  - Core functionalities: card display with filtering, deck building with real-time validation, and decklist management.
  - UI components and interactions based on Angular.
  - Backend part of the project will use Spring Boot.
  - Responsive layout for desktop and mobile devices.
- **Exclusions (MVP):**
  - Algorithms to suggest additional cards.
  - Display of card prices.
  - Functionality to take and save pictures of decks.
  - Suggestions for similar decks or tournament performance analytics.
  - Full implementation of authentication and data persistence (only placeholder considerations are included).

## 5. User Stories

US-001  
Title: View Card Library  
Description: As a casual player, I want to view a paginated list of Mtg cards filtered by expansion so that I can quickly access available cards for deck building.  
Acceptance Criteria:
- The card library is presented in a table with 50 cards per page.
- I can choose an expansion that I want to display in the table.
- Sorting is enabled through clickable column headers.
- Cards are filtered based on selected criteria (e.g., card type, mana cost, rarity).

US-002  
Title: View Card Details  
Description: As a user, I want to click on a card to view its full details (name, mana cost, image, description, etc.) so that I can make informed deck-building decisions.  
Acceptance Criteria:
- A detailed view of the card is displayed upon selection.

US-003  
Title: Add Cards to Deck  
Description: As a casual player, I want to add cards from the selection table to my deck and view the updated deck immediately so that I can build my deck efficiently.  
Acceptance Criteria:
- The deck-building table updates in real time as cards are added.
- The current deck reflects all changes instantly.

US-004  
Title: Deck Validation Feedback  
Description: As a user, I want to receive immediate visual feedback if my deck does not meet validation criteria so that I can quickly correct any mistakes.  
Acceptance Criteria:
- Real-time visual alerts are displayed when the deck has fewer than 60 cards.
- Alerts are triggered if more than 4 copies of any non-land card are present.
- Visual feedback utilizes Angular Material components.

US-005  
Title: Remove Cards from Deck  
Description: As a user, I want a simple and instantaneous way to remove cards from my deck so that I can efficiently modify my deck composition.  
Acceptance Criteria:
- Cards are removed with a single, immediate action.
- Deck validation updates instantly after removal.

US-006  
Title: Save and View Decklists  
Description: As a user, I want to save my deck and view a summary of my saved decks, including details such as deck name, card count, card types, and mana curve, so that I can manage my decks over time.  
Acceptance Criteria:
- Users can save and retrieve decklists.
- A summary view presents all relevant deck statistics.

US-007  
Title: Secure Access (Future Enhancement)  
Description: As a user, I want to log in securely to access my saved decks so that my personal data is protected.  
Acceptance Criteria:
- Placeholder functionality for user authentication is defined.
- Future iterations will implement a robust secure login system.

## 6. Success Metrics
1. At least one user successfully saves a valid deck.
2. Real-time deck validation functions correctly, updating immediately upon any modification.