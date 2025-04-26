# Product Requirements Document (PRD) - mtg-deck-builder

## 1. Product Overview
The 10x-mtg-deck-builder application is designed to provide Magic: The Gathering players with a digital platform to efficiently build and manage their decks. The app eliminates the inefficiencies of traditional paper-based deck tracking by offering a dynamic, responsive interface built with Angular and Angular Material. This tool is intended primarily for casual players who require a simple, real-time deck-building experience with rapid access to card information and streamlined deck composition and management.

## 2. User Problem
Players of Magic: The Gathering often struggle with manually recording deck lists, which is time-consuming and prone to errors. Users need an efficient, digital solution that:
- Provides quick access to a comprehensive library of cards across various expansions.
- Enables easy filtering, sorting, and search for cards by criteria such as expansion, rarity, mana cost, color, and card type.
- Delivers an intuitive deck-building experience with real-time validation to ensure compliance with game rules.
- Facilitates effective management of multiple decks with secure, user-specific access.

## 3. Functional Requirements

### 3.1 Deck Builder (Home) Screen
- **Overview:**
  - The screen is divided into two main sections:
    - **Top Section:** Displays current deck details.
    - **Bottom Section:** A table of available MTG cards that can be added to the current deck.

- **Top Section Details:**
  - **Editable Deck Name:** The deck name is editable and is updated only when the 'Save' button is clicked. After saving, a confirmation message is displayed.
  - **Deck Format Dropdown:** Displays 'Standard' as the active option, with additional options like 'Modern' and 'Pauper' shown as disabled (read-only for now).
  - **Validity Indicator:** A visual badge or icon indicates whether the deck meets validation criteria (e.g., minimum card count and copy limits). Hovering over the badge shows validation messages.
  - **Deck Summary:** Displays the total number of cards in the deck and lists selected cards grouped by card type (e.g., Creature, Land, Artifact, Instant, Sorcery, Enchantment). Each group header uses a larger font and includes the total count for that group. Individual cards are listed with their name, mana cost, and quantity, alongside an option to remove them.
  - **Card Hover Popover:** When a user hovers over a card name, a popover displays the card's image.
  - **Action Buttons:** Includes a 'Save' button (to commit changes to the database) and a 'New' button (to start a new deck).

  - ** Bottom Section Details **
   - Display Mtg cards in a paginated table with 50 cards per page.
   - Enable sorting by clicking on table column headers.
   - Provide an option to display cards from a specific set in the table.
   - Provide filtering options based on rarity, mana cost, color, and card type.
   - Provide a search option on the table based on card name.
   - On selection, display full card details including name, mana cost, image, and description, consider that some cards are double-side: they have a front and back.
   - there is an option in the table to add the selected card to the current deck

### 3.2 Decks Screen
- Displays the user's saved decks in a grid layout using card components.
- Each deck card shows:
  - The deck name.
  - A representative card image from the deck.
  - Buttons for editing and deleting the deck (deletion actions require a confirmation dialog).

### 3.3 Authentication and Account Management
- **Login Screen:**
  - Fields: Username and Password.
  - Validations: Username must be at least 8 characters; Password must be at least 10 characters and include digits and special symbols.
- **Registration Screen:**
  - Fields: Email, Username, and Password.
  - Validations: Email must be valid; Username and Password follow the same rules as the Login screen.
- **Forgot Password Screen:**
  - Field: Email.

### 3.4 Global Features
- **Navigation:**
  - **Desktop:** A top navigation bar with 'Home (Deck Builder)' and 'Decks' on the left, and 'Account' on the right.
  - **Mobile:** A hamburger menu listing 'Home', 'Decks', 'Account', and 'Logout' (placeholder) in that order.
- **State Management:**
  - Use ngrx to manage and persist current deck data (including selected cards, deck name, format, and groupings) across navigation. The deck data is preserved in the UI state until the user explicitly saves it.
- **Error Handling:**
  - Implement a global error handling service that displays differentiated error messages via Angular Material's toast/snackbar for various API exceptions.
- **Responsive Design:**
  - Design distinct layouts for desktop and mobile views using Angular Material's responsive components and Angular Flex Layout to ensure optimal usability across devices.
- **Future Enhancements:**
  - Expand deck format options beyond 'Standard'.
  - Integrate advanced authentication features using Amazon Cognito and additional security enhancements as needed.


## 5. Product Boundaries
- **Inclusions (MVP):**
  - Core functionalities: card display with filtering, deck building with real-time validations, deck management, and basic account authentication.
  - A responsive UI built with Angular and Angular Material, with integration to a Spring Boot backend and external MTG card APIs.
- **Exclusions (MVP):**
  - Algorithms to suggest additional cards.
  - Display of card prices.
  - Functionality to take and save pictures of decks.
  - Suggestions for similar decks or tournament performance analytics.
  - Full implementation of authentication and data persistence (only placeholder considerations are included).
  - Advanced authentication and detailed data persistence features beyond initial deployment.
  - Additional analytics, offline capabilities, or collaborative deck editing features.

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