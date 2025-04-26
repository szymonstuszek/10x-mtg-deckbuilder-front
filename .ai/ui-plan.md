# UI Architecture for MTG Deck Builder

## 1. Overview of UI Structure

The MTG Deck Builder application will follow a component-based architecture using Angular and Angular Material. The UI is structured around two main functional areas: deck building/editing and deck management. The application will feature responsive design for both desktop and mobile views, with clear navigation between different sections. 

Authentication will be integrated through dedicated login, registration, and password recovery screens. The application will use ngrx for state management to ensure deck data persists across navigation until explicitly saved. Error handling will be implemented globally with contextual feedback via Angular Material's snackbar component.

## 2. List of Views

### 2.1 Authentication Views

#### 2.1.1 Login View
- **View Name**: Login
- **View Path**: `/login`
- **Main Purpose**: Authenticate existing users
- **Key Information to Display**: 
  - Login form with username and password fields
  - Validation messages
  - Links to registration and forgot password
- **Key Components of the View**:
  - Login form with validation
  - Submit button
  - Navigation links
- **UX, Accessibility, and Security Considerations**:
  - Clear validation messages (username must be at least 8 characters; password must be at least 10 characters with digits and special symbols)
  - Keyboard navigation support
  - ARIA labels for screen readers
  - Secure password input field

#### 2.1.2 Registration View
- **View Name**: Registration
- **View Path**: `/register`
- **Main Purpose**: Create new user accounts
- **Key Information to Display**:
  - Registration form with email, username, and password fields
  - Validation messages
- **Key Components of the View**:
  - Registration form with validation
  - Submit button
  - Navigation link to login
- **UX, Accessibility, and Security Considerations**:
  - Clear validation messages for all fields
  - Progressive disclosure of validation requirements
  - ARIA labels for screen readers
  - Password strength indicator

#### 2.1.3 Forgot Password View
- **View Name**: Forgot Password
- **View Path**: `/forgot-password`
- **Main Purpose**: Allow users to reset forgotten passwords
- **Key Information to Display**:
  - Email input field
  - Validation messages
  - Success/error feedback
- **Key Components of the View**:
  - Email form with validation
  - Submit button
  - Navigation link to login
- **UX, Accessibility, and Security Considerations**:
  - Clear success message after submission
  - Email validation
  - ARIA labels for screen readers

### 2.2 Main Application Views

#### 2.2.1 Deck Builder View (Home)
- **View Name**: Deck Builder
- **View Path**: `/` (home)
- **Main Purpose**: Primary interface for creating and editing decks
- **Key Information to Display**:
  - Top Section:
    - Editable deck name
    - Deck format dropdown (Standard as active, with disabled options)
    - Deck validity indicator
    - Action buttons (Save, New)
    - Deck summary grouped by card type
  - Bottom Section:
    - Card selection table with filtering options
    - Pagination controls
- **Key Components of the View**:
  - Deck header with editing capabilities
  - Deck validity badge with tooltip
  - Card grouping section with quantity management
  - Card hover popover for image preview
  - Card search and filter panel
  - Card data table with pagination
- **UX, Accessibility, and Security Considerations**:
  - Real-time feedback on deck validity
  - Keyboard accessible controls for adding/removing cards
  - High contrast visual indicators for card groupings
  - Clear confirmation messages after save operations
  - Responsive layout for different screen sizes

#### 2.2.2 Decks View
- **View Name**: Decks
- **View Path**: `/decks`
- **Main Purpose**: Display and manage saved decks
- **Key Information to Display**:
  - Grid of saved decks
  - For each deck: name, representative card image, and action buttons
- **Key Components of the View**:
  - Deck card grid
  - Edit and delete buttons on each deck card
  - Confirmation dialog for delete actions
- **UX, Accessibility, and Security Considerations**:
  - Visual focus indicators
  - Keyboard navigation between deck cards
  - Confirmation dialog for destructive actions
  - Clear visual hierarchy

#### 2.2.3 Account View
- **View Name**: Account
- **View Path**: `/account`
- **Main Purpose**: User account management
- **Key Information to Display**:
  - User information
  - Account settings (placeholder for future implementation)
- **Key Components of the View**:
  - User profile information
  - Placeholder for future account management features
- **UX, Accessibility, and Security Considerations**:
  - Clear information hierarchy
  - Secure handling of user data
  - ARIA labels for screen readers

## 3. User Journey Map

### 3.1 New User Journey
1. User arrives at the application and is directed to the Login screen
2. User selects "Register" to create a new account
3. User completes registration form and submits
4. Upon successful registration, user is redirected to Login
5. User logs in with newly created credentials
6. User lands on the Deck Builder (Home) screen
7. User creates a new deck:
   - Sets deck name
   - Views available cards in the bottom section
   - Searches/filters cards based on criteria
   - Selects cards to add to deck
   - Monitors deck validity as cards are added
   - Clicks "Save" to store the deck
8. User navigates to Decks screen to view saved deck
9. User can select the deck to edit or delete it

### 3.2 Returning User Journey
1. User logs in with existing credentials
2. User lands on the Deck Builder (Home) screen
3. User either:
   - Creates a new deck (flow as above)
   - Navigates to Decks screen to manage existing decks
4. On the Decks screen, user can:
   - View all saved decks
   - Select a deck to edit (redirected to Deck Builder with selected deck loaded)
   - Delete a deck (with confirmation)

### 3.3 Deck Building Journey
1. User starts with either a new deck or editing an existing one in the Deck Builder
2. User sets/updates the deck name
3. User searches/filters cards in the bottom section table
4. User adds selected cards to the deck:
   - Card is added to appropriate type grouping in the top section
   - Deck card count and validity are updated
5. User can hover over card names to view card images
6. User can remove cards from the deck as needed
7. User saves the deck, receiving confirmation
8. User can start a new deck or navigate to see all decks

## 4. Layout and Navigation Structure

### 4.1 Navigation Components
- **Desktop**: Top navigation bar
  - Left: "Home" and "Decks" navigation links
  - Right: "Account" navigation link
- **Mobile**: Hamburger menu
  - Menu items in order: "Home", "Decks", "Account", "Logout" (placeholder)

### 4.2 Layout Structure
- Authentication screens: Centered card layout
- Deck Builder (Home):
  - Top section: Flex layout with deck details and card groupings
  - Bottom section: Full-width table with search/filter controls
- Decks screen: Responsive grid layout with cards
- Account screen: Vertical sections for different account aspects

### 4.3 Navigation Flow
- Unauthenticated users can only access authentication views
- Authenticated users can navigate freely between Home, Decks, and Account
- When editing a deck from the Decks screen, users are navigated to Home with the selected deck loaded
- When saving a deck, users remain on the Home screen with confirmation feedback
- Deleting a deck keeps users on the Decks screen with confirmation feedback

## 5. Key Components

### 5.1 Shared Components
- **Navigation Bar/Menu**: Provides consistent navigation throughout the application
- **Error Snackbar**: Displays contextual error messages via Angular Material snackbar
- **Confirmation Dialog**: Reusable dialog for confirming destructive actions
- **Loading Indicator**: Visual feedback during API requests
- **Card Image Popover**: Displays card images on hover

### 5.2 Authentication Components
- **Auth Forms**: Standardized forms with consistent validation
- **Validation Feedback**: Inline error messages for form validation

### 5.3 Deck Builder Components
- **Deck Header**: Contains editable name, format dropdown, and action buttons
- **Deck Validity Badge**: Visual indicator of deck validity with tooltip
- **Card Group Container**: Sections for different card types
- **Card Item**: Display of individual cards with quantity controls
- **Card Search Panel**: Controls for filtering the card table
- **Card Data Table**: Paginated display of available cards

### 5.4 Decks View Components
- **Deck Card**: Visual representation of a saved deck
- **Deck Actions**: Edit and delete buttons with appropriate handling

### 5.5 State Management
- **Deck State**: ngrx store for current deck information
- **Auth State**: User authentication state
- **UI State**: Application UI state (loading indicators, error messages) 