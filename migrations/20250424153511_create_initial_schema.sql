/*
 * Migration: 20250424153511_create_initial_schema.sql
 * 
 * Purpose: Create the initial database schema for the MTG Deck Builder application
 * 
 * Tables created:
 *   - Users: Stores basic user information linked with Amazon Cognito
 *   - Cards: Stores card information retrieved from MTG API
 *   - Decks: Stores deck metadata created by users
 *   - Deck_Cards: Junction table for the many-to-many relationship between decks and cards
 * 
 * Date: 2025-04-24
 */

-- Start transaction to ensure the migration is atomic
BEGIN;

-- -----------------------------------------------------
-- Table: Users
-- Purpose: Store basic user information from Amazon Cognito
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "users" (
    "sub" TEXT PRIMARY KEY NOT NULL, -- Cognito unique identifier
    "email" TEXT NOT NULL
);

COMMENT ON TABLE "users" IS 'Stores user information from Amazon Cognito authentication';
COMMENT ON COLUMN "users"."sub" IS 'Unique identifier from Amazon Cognito';
COMMENT ON COLUMN "users"."email" IS 'User email address';

-- -----------------------------------------------------
-- Table: Cards
-- Purpose: Store card information retrieved from MTG API
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "cards" (
    "id" SERIAL PRIMARY KEY,
    "api_id" TEXT NOT NULL, 
    "name" TEXT NOT NULL,
    "mana_cost" TEXT,
    "cmc" NUMERIC,
    "colors" TEXT[],
    "color_identity" TEXT[],
    "type" TEXT,
    "types" TEXT[],
    "subtypes" TEXT[],
    "rarity" TEXT,
    "set" TEXT,
    "set_name" TEXT,
    "card_text" TEXT,
    "artist" TEXT,
    "number" TEXT,
    "power" TEXT,
    "toughness" TEXT,
    "layout" TEXT,
    "multiverseid" TEXT,
    "image_url" TEXT,
    "original_text" TEXT,
    "original_type" TEXT
);

COMMENT ON TABLE "cards" IS 'Stores card information retrieved from MTG API';
COMMENT ON COLUMN "cards"."id" IS 'Internal unique identifier';
COMMENT ON COLUMN "cards"."api_id" IS 'Original ID from the MTG API to prevent duplicates';
COMMENT ON COLUMN "cards"."name" IS 'Card name';
COMMENT ON COLUMN "cards"."mana_cost" IS 'Mana cost in text form (e.g., {2}{W}{W})';
COMMENT ON COLUMN "cards"."cmc" IS 'Converted mana cost (numeric value)';
COMMENT ON COLUMN "cards"."colors" IS 'Array of colors (e.g., [W, B])';
COMMENT ON COLUMN "cards"."color_identity" IS 'Array of colors in the card color identity';
COMMENT ON COLUMN "cards"."type" IS 'Full type line of the card';
COMMENT ON COLUMN "cards"."types" IS 'Array of card types (e.g., [Creature, Artifact])';
COMMENT ON COLUMN "cards"."subtypes" IS 'Array of card subtypes (e.g., [Human, Cleric])';
COMMENT ON COLUMN "cards"."rarity" IS 'Card rarity (e.g., Common, Uncommon, Rare, Mythic)';
COMMENT ON COLUMN "cards"."set" IS 'Set code the card belongs to';
COMMENT ON COLUMN "cards"."set_name" IS 'Full name of the set';
COMMENT ON COLUMN "cards"."card_text" IS 'Rules text of the card';
COMMENT ON COLUMN "cards"."artist" IS 'Artist name';
COMMENT ON COLUMN "cards"."number" IS 'Card number within the set';
COMMENT ON COLUMN "cards"."power" IS 'Power value for creatures';
COMMENT ON COLUMN "cards"."toughness" IS 'Toughness value for creatures';
COMMENT ON COLUMN "cards"."layout" IS 'Card layout (e.g., normal, split, flip, transform)';
COMMENT ON COLUMN "cards"."multiverseid" IS 'Multiverse ID from Gatherer';
COMMENT ON COLUMN "cards"."image_url" IS 'URL to the card image';
COMMENT ON COLUMN "cards"."original_text" IS 'Original printed text';
COMMENT ON COLUMN "cards"."original_type" IS 'Original printed type';

-- -----------------------------------------------------
-- Table: Decks
-- Purpose: Store deck metadata created by users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "decks" (
    "id" SERIAL PRIMARY KEY,
    "user_sub" TEXT NOT NULL,
    "deck_name" TEXT NOT NULL,
    "deck_format" TEXT NOT NULL,
    "deck_description" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_sub") REFERENCES "users" ("sub")
);

COMMENT ON TABLE "decks" IS 'Stores deck metadata created by users';
COMMENT ON COLUMN "decks"."id" IS 'Unique identifier for the deck';
COMMENT ON COLUMN "decks"."user_sub" IS 'Reference to the owner user';
COMMENT ON COLUMN "decks"."deck_name" IS 'Name of the deck';
COMMENT ON COLUMN "decks"."deck_format" IS 'Format of the deck (e.g., Standard)';
COMMENT ON COLUMN "decks"."deck_description" IS 'Optional description of the deck';
COMMENT ON COLUMN "decks"."created_at" IS 'Timestamp when the deck was created';
COMMENT ON COLUMN "decks"."updated_at" IS 'Timestamp when the deck was last updated';

-- -----------------------------------------------------
-- Table: Deck_Cards (Junction Table)
-- Purpose: Manage the many-to-many relationship between decks and cards
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "deck_cards" (
    "deck_id" INTEGER NOT NULL,
    "card_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    PRIMARY KEY ("deck_id", "card_id"),
    FOREIGN KEY ("deck_id") REFERENCES "decks" ("id"),
    FOREIGN KEY ("card_id") REFERENCES "cards" ("id")
);

COMMENT ON TABLE "deck_cards" IS 'Junction table for the many-to-many relationship between decks and cards';
COMMENT ON COLUMN "deck_cards"."deck_id" IS 'Reference to the deck';
COMMENT ON COLUMN "deck_cards"."card_id" IS 'Reference to the card';
COMMENT ON COLUMN "deck_cards"."quantity" IS 'Number of copies of the card in the deck';

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on decks table
CREATE TRIGGER update_decks_updated_at
BEFORE UPDATE ON "decks"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add a check constraint to ensure quantity is positive
ALTER TABLE "deck_cards" ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);

-- Disable row-level security by default (can be enabled later)
-- ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

-- SQL to implement RLS when needed:
-- CREATE POLICY deck_rls_policy ON decks
--   FOR ALL
--   USING (user_sub = current_setting('app.current_user')::text);

COMMIT; 