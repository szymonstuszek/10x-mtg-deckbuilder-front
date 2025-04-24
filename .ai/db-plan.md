## Database Schema for 10x-mtg-deck-builder MVP

### 1. Tables

#### a. Users

- **sub**: TEXT PRIMARY KEY NOT NULL
- **email**: TEXT NOT NULL

#### b. Cards

- **id**: SERIAL PRIMARY KEY
- **api_id**: TEXT NOT NULL UNIQUE
- **name**: TEXT NOT NULL
- **mana_cost**: TEXT
- **cmc**: NUMERIC
- **colors**: TEXT[]
- **color_identity**: TEXT[]
- **type**: TEXT
- **types**: TEXT[]
- **subtypes**: TEXT[]
- **rarity**: TEXT
- **set**: TEXT
- **set_name**: TEXT
- **card_text**: TEXT
- **artist**: TEXT
- **number**: TEXT
- **power**: TEXT
- **toughness**: TEXT
- **layout**: TEXT
- **multiverseid**: TEXT
- **image_url**: TEXT
- **original_text**: TEXT
- **original_type**: TEXT


#### c. Decks

- **id**: SERIAL PRIMARY KEY
- **user_sub**: TEXT NOT NULL
- **deck_name**: TEXT NOT NULL
- **deck_format**: TEXT NOT NULL
- **deck_description**: TEXT
- **created_at**: TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP

*Foreign Key*: `user_sub` references `Users(sub)`.

#### d. Deck_Cards (Join Table)

- **deck_id**: INTEGER NOT NULL
- **card_id**: INTEGER NOT NULL
- **quantity**: INTEGER NOT NULL

*Primary Key*: (deck_id, card_id)

*Foreign Keys*:
- `deck_id` references `Decks(id)`
- `card_id` references `Cards(id)`

### 2. Relationships

- **Users** to **Decks**: One-to-Many. A user (identified by `sub`) can have many decks.
- **Decks** to **Cards**: Many-to-Many through **Deck_Cards**. A deck can contain multiple cards and a card can appear in multiple decks. The `quantity` column in **Deck_Cards** indicates the number of copies of a given card in a deck.

### 3. Indexes

- The primary keys on all tables are automatically indexed.
- **Deck_Cards** has a composite primary key on `(deck_id, card_id)`, which serves as an index to optimize queries by `deck_id`.


<!-- disabling for learning purposes
### 4. PostgreSQL Row-Level Security Policies

*Note*: The application is expected to set a session variable `app.current_user` with the current user's `sub` value.

```sql
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY deck_rls_policy ON decks
  FOR ALLg
  USING (user_sub = current_setting('app.current_user')::text);
```

This policy ensures that users can only access decks associated with their own `sub` identifier. -->

### 5. Additional Notes

- **Migration & Flexibility**: Although the schema is kept simple for the MVP, it has been designed with future migration strategies in mind, especially to handle potential changes in card attributes from the external API.
- **Data Types and Arrays**: Array types are used for fields like `colors`, `color_identity`, `types`, and `subtypes` to support multiple values.
- **Scalability**: The design anticipates rapid growth of the Deck_Cards table. The composite primary key on `(deck_id, card_id)` ensures efficient queries. Future indexing and partitioning strategies can be evaluated as data volume increases.
- **Security**: Basic row-level security is implemented on the Decks table. Further security enhancements can be added as needed. 