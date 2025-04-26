# REST API Plan

## 1. Resources

- **Users**: Represents application users (table: Users).
  - Fields: sub (primary key), email.

- **Cards**: Represents Magic: The Gathering cards (table: Cards).
  - Fields include: id, api_id, name, mana_cost, cmc, colors, color_identity, type, types, subtypes, rarity, set, set_name, card_text, artist, number, power, toughness, layout, multiverseid, image_url, original_text, original_type.

- **Decks**: Represents individual decks created by users (table: Decks).
  - Fields: id, user_sub (foreign key referencing Users.sub), deck_name, deck_format, deck_description, created_at, updated_at.

- **Deck_Cards**: Join table that links Decks and Cards (table: Deck_Cards).
  - Fields: deck_id, card_id, quantity (composite primary key: deck_id and card_id).

## 2. Endpoints

### Users

1. **GET /users/me**
   - Description: Retrieve the authenticated user's profile.
   - HTTP Method: GET
   - URL Path: `/users/me`
   - JSON Response Payload Structure:
     ```json
     {
       "sub": "user-sub-identifier",
       "email": "user@example.com"
     }
     ```
   - Success Codes: 200 OK
   - Error Codes: 401 Unauthorized

### Cards

1. **GET /cards**
   - Description: Retrieve a paginated, filterable, and sortable list of cards for deck building.
   - Important: these cards will not be retrieved from the database, but from magicthegathering.io's API, documentation link: https://docs.magicthegathering.io/#documentationgetting_started
   - HTTP Method: GET
   - URL Path: `/cards`
   - Query Parameters:
     - `set` (string) set code
     - `page` (integer): Page number (default: 1).
     - `pageSize` (integer): Number of cards per page (default: 50).
     - `sort` (string): Column name to sort by (e.g., name, rarity, mana_cost).
     - `order` (string): `asc` or `desc`.
     - Optional filters: `set`, `rarity`, `mana_cost`, `color`, `type`, `name` (search by card name).
   - JSON Response Payload Structure:
     ```json
     {
       "cards": [
         {
           "id": 1,
           "api_id": "external-id",
           "name": "Card Name",
           "mana_cost": "{2}{W}",
           "cmc": 3,
           "colors": ["W"],
           "type": "Creature",
           "rarity": "Rare",
           "set": "SET_CODE",
           "image_url": "http://..."
         }
       ],
       "pagination": {
         "page": 1,
         "pageSize": 50,
         "totalPages": 10,
         "totalRecords": 500
       }
     }
     ```
   - Success Codes: 200 OK
   - Error Codes: 400 Bad Request
    

### Decks

1. **GET /decks**
   - Description: Retrieve a list of decks for the authenticated user.
   - HTTP Method: GET
   - URL Path: `/decks`
   - JSON Response Payload Structure:
     ```json
     [
       {
         "id": 1,
         "deck_name": "My First Deck",
         "deck_format": "Standard",
         "deck_description": "A sample deck",
         "created_at": "2023-10-01T12:00:00Z",
         "updated_at": "2023-10-01T12:00:00Z"
       }
     ]
     ```
   - Success Codes: 200 OK
   - Error Codes: 401 Unauthorized

2. **POST /decks**
   - Description: Create a new deck.
   - HTTP Method: POST
   - URL Path: `/decks`
   - JSON Request Payload Structure:
     ```json
     {
       "deck_name": "My New Deck",
       "deck_format": "Standard",
       "deck_description": "Optional description",
       "cards": [ // Optional initial cards
         {
           "quantity": 1,
           "card": {
             "api_id": "external-id",
             "name": "Card Name",
             "mana_cost": "{2}{W}",
             "cmc": 3,
             "colors": ["W"],
             "color_identity": ["W"],
             "type": "Creature",
             "types": ["Creature"],
             "subtypes": ["Human", "Warrior"],
             "rarity": "Rare",
             "set": "SET_CODE",
             "set_name": "Set Name",
             "card_text": "Card description text",
             "artist": "Artist Name",
             "number": "001",
             "power": "2",
             "toughness": "2",
             "layout": "normal",
             "multiverseid": "12345",
             "image_url": "http://...",
             "original_text": "Original card text",
             "original_type": "Original type line"
           }
         }
       ]
     }
     ```
   - Success Codes: 201 Created
   - Error Codes: 400 Bad Request, 401 Unauthorized

3. **GET /decks/{deckId}**
   - Description: Retrieve detailed information about a specific deck including its cards and statistics.
   - HTTP Method: GET
   - URL Path: `/decks/{deckId}`
   - JSON Response Payload Structure:
     ```json
     {
       "id": 1,
       "deck_name": "My Deck",
       "deck_format": "Standard",
       "deck_description": "...",
       "created_at": "2023-10-01T12:00:00Z",
       "updated_at": "2023-10-01T12:00:00Z",
       "cards": [
         {
           "quantity": 3,
           "card": {
             "api_id": "external-id",
             "name": "Card Name",
             "mana_cost": "{2}{W}",
             "cmc": 3,
             "colors": ["W"],
             "color_identity": ["W"],
             "type": "Creature",
             "types": ["Creature"],
             "subtypes": ["Human", "Warrior"],
             "rarity": "Rare",
             "set": "SET_CODE",
             "set_name": "Set Name",
             "card_text": "Card description text",
             "artist": "Artist Name",
             "number": "001",
             "power": "2",
             "toughness": "2",
             "layout": "normal",
             "multiverseid": "12345",
             "image_url": "http://...",
             "original_text": "Original card text",
             "original_type": "Original type line"
           }
         }
       ],
       "statistics": {
         "total_cards": 64,
         "types": { "Creature": 40, "Sorcery": 10, "Instant": 14 },
         "mana_curve": { "1": 5, "2": 10, "3": 15, "4": 20, "5": 10, "6+": 4 }
       }
     }
     ```
   - Success Codes: 200 OK
   - Error Codes: 401 Unauthorized, 404 Not Found

4. **PUT /decks/{deckId}**
   - Description: Update deck properties and its card list.
   - HTTP Method: PUT
   - URL Path: `/decks/{deckId}`
   - JSON Request Payload Structure:
     ```json
     {
       "deck_name": "Updated Deck Name",
       "deck_description": "Updated description",
       "cards": [
         {
           "quantity": 3,
           "card": {
             "api_id": "external-id",
             "name": "Card Name",
             "mana_cost": "{2}{W}",
             "cmc": 3,
             "colors": ["W"],
             "color_identity": ["W"],
             "type": "Creature",
             "types": ["Creature"],
             "subtypes": ["Human", "Warrior"],
             "rarity": "Rare",
             "set": "SET_CODE",
             "set_name": "Set Name",
             "card_text": "Card description text",
             "artist": "Artist Name",
             "number": "001",
             "power": "2",
             "toughness": "2",
             "layout": "normal",
             "multiverseid": "12345",
             "image_url": "http://...",
             "original_text": "Original card text",
             "original_type": "Original type line"
           }
         }
       ]
     }
     ```
   - Business Logic: Validate that no card exceeds the limit of 4 copies (for non-land cards).
   - Success Codes: 200 OK
   - Error Codes: 400 Bad Request, 401 Unauthorized, 404 Not Found

5. **DELETE /decks/{deckId}**
   - Description: Delete a deck.
   - HTTP Method: DELETE
   - URL Path: `/decks/{deckId}`
   - Success Codes: 200 OK
   - Error Codes: 401 Unauthorized, 404 Not Found

6. **GET /decks/{deckId}/stats**
   - Description: Retrieve statistical information for a deck (e.g., card type counts, mana curve, distribution of colors).
   - HTTP Method: GET
   - URL Path: `/decks/{deckId}/stats`
   - JSON Response Payload Structure:
     ```json
     {
       "total_cards": 64,
       "types": { "Creature": 40, "Sorcery": 10, "Instant": 14 },
       "mana_curve": { "1": 5, "2": 10, "3": 15, "4": 20, "5": 10, "6+": 4 },
       "colors": { "White": 30, "Blue": 10, "Black": 8, "Red": 8, "Green": 8 }
     }
     ```
   - Success Codes: 200 OK
   - Error Codes: 401 Unauthorized, 404 Not Found

7. **GET /decks/{deckId}/random**
    - Description: Retrieve a random non-land card from the deck, useful for deck preview.
    - HTTP Method: GET
    - URL Path: `/decks/{deckId}/random`
    - JSON Response Payload Structure:
      ```json
      {
        "card": {
          "id": 3,
          "name": "Random Card Name",
          "mana_cost": "{3}{U}",
          "type": "Creature",
          "image_url": "http://..."
        }
      }
      ```
    - Success Codes: 200 OK
    - Error Codes: 401 Unauthorized, 404 Not Found

## 3. Authentication and Authorization

- **Mechanism**: Use Amazon Cognito for user authentication. Clients must include a JWT in the `Authorization` header as a Bearer token.
- **Enforcement**: All endpoints (except possibly public card listings) require authentication. The API and database row-level security ensure that users can only access and manage their own decks.
- **Implementation**: The backend (Spring Boot) will verify the JWT on each request and set the corresponding `user_sub` for authorization checks.

## 4. Validation and Business Logic

- **General Validation**:
  - Validate request payloads using a schema validation library.
  - Ensure query parameters conform to expected formats (e.g., numeric for pagination).

- **Deck Validation**:
  - **Minimum Deck Size**: A standard deck must have at least 60 cards. (PRD: "A standard deck must contain a minimum of 60 cards.")
  - **Copy Limit**: No more than 4 copies of any non-land card are allowed. (PRD: "No more than 4 copies of any non-land card are allowed.")
  - Validation occurs during deck updates.

- **Business Logic Mapping**:
  - **Card Display**: Implement filtering, sorting, and pagination in the `/cards` endpoint based on query parameters.
  - **Deck Statistics**: Calculations for card types, mana curve, and color distribution handled dynamically in the `/decks/{deckId}/stats` endpoint.
  - **Random Card Selection**: Logic to retrieve a random non-land card from the deck in `/decks/{deckId}/random`.

- **Security and Performance Requirements**:
  - **Security**: Use JWT for authentication, enforce row-level security (only the owner can manage a deck), and employ rate limiting to prevent abuse.
  - **Performance**: Implement pagination for list endpoints and consider caching frequently accessed card data.

- **HTTP Status Codes**:
  - 200 OK, 201 Created for successful operations.
  - 400 Bad Request for invalid inputs or business rule violations.
  - 401 Unauthorized for missing or invalid authentication.
  - 403 Forbidden where applicable (if a user tries to access another user's data).
  - 404 Not Found for resources that cannot be located.

---

*Assumptions*: 
- Users are primarily managed via Cognito; minimal CRUD operations are exposed for user profiles.
- Cards data is typically read-only and pre-seeded, so no create/update/delete endpoints are exposed for cards.
- Business logic is enforced within each endpoint rather than through separate services.
- The API will use standard libraries in Spring Boot for validations and security integration. 