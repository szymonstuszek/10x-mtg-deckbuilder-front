/*
 * Migration: 20250424154154_insert_sample_data.sql
 * 
 * Purpose: Insert sample data into the MTG Deck Builder application tables
 * 
 * Tables affected:
 *   - Users: Sample user accounts
 *   - Cards: Sample MTG cards
 *   - Decks: Sample decks created by users
 *   - Deck_Cards: Sample relationships between decks and cards
 * 
 * Date: 2025-04-24
 * 
 * Note: This migration is for development and testing purposes only.
 *       It should not be run in a production environment with real user data.
 */

-- Start transaction to ensure the migration is atomic
BEGIN;

-- Add the missing UNIQUE constraint to the cards table api_id column
-- We need to do this first as our sample data relies on api_id being unique
ALTER TABLE "cards" ADD CONSTRAINT "cards_api_id_key" UNIQUE ("api_id");

-- -----------------------------------------------------
-- Sample Users
-- -----------------------------------------------------
INSERT INTO "users" ("sub", "email") VALUES
    ('auth0|123456789012', 'john.doe@example.com'),
    ('auth0|234567890123', 'jane.smith@example.com'),
    ('auth0|345678901234', 'bob.johnson@example.com');

-- -----------------------------------------------------
-- Sample Cards
-- -----------------------------------------------------
INSERT INTO "cards" (
    "api_id", "name", "mana_cost", "cmc", "colors", "color_identity", 
    "type", "types", "subtypes", "rarity", "set", "set_name", 
    "card_text", "artist", "number", "power", "toughness", "layout", 
    "multiverseid", "image_url", "original_text", "original_type"
) VALUES
    -- White Cards
    (
        '5f8287b1-5bb6-5f4c-ad17-316a40d5bb0c', 
        'Ancestor''s Chosen', 
        '{5}{W}{W}', 
        7.0, 
        ARRAY['W'], 
        ARRAY['W'], 
        'Creature — Human Cleric', 
        ARRAY['Creature'], 
        ARRAY['Human', 'Cleric'], 
        'Uncommon', 
        '10E', 
        'Tenth Edition', 
        'First strike (This creature deals combat damage before creatures without first strike.)\nWhen Ancestor''s Chosen enters the battlefield, you gain 1 life for each card in your graveyard.', 
        'Pete Venters', 
        '1', 
        '4', 
        '4', 
        'normal', 
        '130550', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130550&type=card', 
        'First strike\nWhen Ancestor''s Chosen comes into play, you gain 1 life for each card in your graveyard.', 
        'Creature - Human Cleric'
    ),
    (
        '94f9ae57-1a28-4483-a297-7224b56eb22a', 
        'Angel of Mercy', 
        '{4}{W}', 
        5.0, 
        ARRAY['W'], 
        ARRAY['W'], 
        'Creature — Angel', 
        ARRAY['Creature'], 
        ARRAY['Angel'], 
        'Uncommon', 
        '10E', 
        'Tenth Edition', 
        'Flying\nWhen Angel of Mercy enters the battlefield, you gain 3 life.', 
        'Randy Gallegos', 
        '2', 
        '3', 
        '3', 
        'normal', 
        '129465', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129465&type=card', 
        'Flying\nWhen Angel of Mercy comes into play, you gain 3 life.', 
        'Creature - Angel'
    ),
    
    -- Blue Cards
    (
        '8f2e9e1d-ddb9-43a3-9d93-61e781adf3a5', 
        'Archaeomancer', 
        '{2}{U}{U}', 
        4.0, 
        ARRAY['U'], 
        ARRAY['U'], 
        'Creature — Human Wizard', 
        ARRAY['Creature'], 
        ARRAY['Human', 'Wizard'], 
        'Common', 
        'M14', 
        'Magic 2014 Core Set', 
        'When Archaeomancer enters the battlefield, return target instant or sorcery card from your graveyard to your hand.', 
        'Alex Horley-Orlandelli', 
        '43', 
        '1', 
        '2', 
        'normal', 
        '370670', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=370670&type=card', 
        'When Archaeomancer enters the battlefield, return target instant or sorcery card from your graveyard to your hand.', 
        'Creature — Human Wizard'
    ),
    (
        '0d438a08-6ddd-4186-a68e-98c0f77b3255', 
        'Counterspell', 
        '{U}{U}', 
        2.0, 
        ARRAY['U'], 
        ARRAY['U'], 
        'Instant', 
        ARRAY['Instant'], 
        ARRAY[]::text[], 
        'Uncommon', 
        '7ED', 
        'Seventh Edition', 
        'Counter target spell.', 
        'Mark Poole', 
        '67', 
        NULL, 
        NULL, 
        'normal', 
        '11214', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=11214&type=card', 
        'Counter target spell.', 
        'Instant'
    ),
    
    -- Black Cards
    (
        'fe9d85c7-f07b-49eb-8d80-7f7c87f67280', 
        'Dark Ritual', 
        '{B}', 
        1.0, 
        ARRAY['B'], 
        ARRAY['B'], 
        'Instant', 
        ARRAY['Instant'], 
        ARRAY[]::text[], 
        'Common', 
        'A25', 
        'Masters 25', 
        'Add {B}{B}{B}.', 
        'Jesper Myrfors', 
        '84', 
        NULL, 
        NULL, 
        'normal', 
        '442077', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442077&type=card', 
        'Add {B}{B}{B} to your mana pool.', 
        'Instant'
    ),
    (
        '64bc7e9b-ea5f-41cc-bc7a-b2d58f6e96c9', 
        'Dread', 
        '{3}{B}{B}{B}', 
        6.0, 
        ARRAY['B'], 
        ARRAY['B'], 
        'Creature — Elemental Incarnation', 
        ARRAY['Creature'], 
        ARRAY['Elemental', 'Incarnation'], 
        'Rare', 
        'LRW', 
        'Lorwyn', 
        'Fear (This creature can''t be blocked except by artifact creatures and/or black creatures.)\nIf a creature would be put into an opponent''s graveyard from anywhere, exile it instead.', 
        'Kev Walker', 
        '107', 
        '6', 
        '6', 
        'normal', 
        '140161', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=140161&type=card', 
        'Fear\nIf a creature would be put into an opponent''s graveyard from play, exile it instead.', 
        'Creature — Elemental Incarnation'
    ),
    
    -- Red Cards
    (
        '4c99b4dc-5693-4684-a7f7-c71055345055', 
        'Lightning Bolt', 
        '{R}', 
        1.0, 
        ARRAY['R'], 
        ARRAY['R'], 
        'Instant', 
        ARRAY['Instant'], 
        ARRAY[]::text[], 
        'Common', 
        'M11', 
        'Magic 2011', 
        'Lightning Bolt deals 3 damage to any target.', 
        'Christopher Rush', 
        '149', 
        NULL, 
        NULL, 
        'normal', 
        '205227', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=205227&type=card', 
        'Lightning Bolt deals 3 damage to target creature or player.', 
        'Instant'
    ),
    (
        '42bf2cc1-e427-4a27-b30e-298dcc7937cb', 
        'Shivan Dragon', 
        '{4}{R}{R}', 
        6.0, 
        ARRAY['R'], 
        ARRAY['R'], 
        'Creature — Dragon', 
        ARRAY['Creature'], 
        ARRAY['Dragon'], 
        'Rare', 
        'M14', 
        'Magic 2014 Core Set', 
        'Flying\n{R}: Shivan Dragon gets +1/+0 until end of turn.', 
        'Donato Giancola', 
        '154', 
        '5', 
        '5', 
        'normal', 
        '370818', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=370818&type=card', 
        'Flying\n{R}: Shivan Dragon gets +1/+0 until end of turn.', 
        'Creature — Dragon'
    ),
    
    -- Green Cards
    (
        'cfc75e87-4c58-4dcf-bf3b-a1f3a241cdb4', 
        'Birds of Paradise', 
        '{G}', 
        1.0, 
        ARRAY['G'], 
        ARRAY['G'], 
        'Creature — Bird', 
        ARRAY['Creature'], 
        ARRAY['Bird'], 
        'Rare', 
        'M12', 
        'Magic 2012', 
        'Flying\n{T}: Add one mana of any color.', 
        'Marcelo Vignali', 
        '165', 
        '0', 
        '1', 
        'normal', 
        '221896', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=221896&type=card', 
        'Flying\n{T}: Add one mana of any color to your mana pool.', 
        'Creature — Bird'
    ),
    (
        '7c6af75f-ab3c-49fc-a54a-bfb0bcc97bf4', 
        'Llanowar Elves', 
        '{G}', 
        1.0, 
        ARRAY['G'], 
        ARRAY['G'], 
        'Creature — Elf Druid', 
        ARRAY['Creature'], 
        ARRAY['Elf', 'Druid'], 
        'Common', 
        'M12', 
        'Magic 2012', 
        '{T}: Add {G}.', 
        'Zoltan Boros & Gabor Szikszai', 
        '182', 
        '1', 
        '1', 
        'normal', 
        '221892', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=221892&type=card', 
        '{T}: Add {G} to your mana pool.', 
        'Creature — Elf Druid'
    ),
    
    -- Multicolor Cards
    (
        '835adc5e-5330-49e5-a90c-d8135b477726', 
        'Niv-Mizzet, the Firemind', 
        '{2}{U}{U}{R}{R}', 
        6.0, 
        ARRAY['U', 'R'], 
        ARRAY['U', 'R'], 
        'Legendary Creature — Dragon Wizard', 
        ARRAY['Legendary', 'Creature'], 
        ARRAY['Dragon', 'Wizard'], 
        'Rare', 
        'GPT', 
        'Guildpact', 
        'Flying\nWhenever you draw a card, Niv-Mizzet, the Firemind deals 1 damage to any target.\n{T}: Draw a card.', 
        'Todd Lockwood', 
        '123', 
        '4', 
        '4', 
        'normal', 
        '96952', 
        'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=96952&type=card', 
        'Flying\nWhenever you draw a card, Niv-Mizzet, the Firemind deals 1 damage to target creature or player.\n{T}: Draw a card.', 
        'Legendary Creature — Dragon Wizard'
    );

-- -----------------------------------------------------
-- Sample Decks
-- -----------------------------------------------------
INSERT INTO "decks" ("user_sub", "deck_name", "deck_format", "deck_description", "created_at", "updated_at") VALUES
    ('auth0|123456789012', 'Blue Control', 'Standard', 'A control deck focused on countering opponent''s spells and drawing cards', '2025-01-15 10:30:00', '2025-01-15 10:30:00'),
    ('auth0|123456789012', 'Red Aggro', 'Standard', 'An aggressive deck with fast creatures and direct damage spells', '2025-01-20 14:45:00', '2025-01-20 14:45:00'),
    ('auth0|234567890123', 'Green Stompy', 'Standard', 'A deck with large green creatures that overwhelm the opponent', '2025-02-05 09:15:00', '2025-02-05 09:15:00'),
    ('auth0|345678901234', 'White Weenie', 'Standard', 'A deck with many small white creatures that gain advantages over time', '2025-02-10 16:20:00', '2025-02-10 16:20:00');

-- -----------------------------------------------------
-- Sample Deck_Cards
-- -----------------------------------------------------
-- Note: We use subqueries to get the IDs rather than hardcoding them
-- This ensures that the relationships are valid even if the auto-incremented IDs change

-- Blue Control Deck
INSERT INTO "deck_cards" ("deck_id", "card_id", "quantity") 
VALUES 
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Blue Control' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Counterspell' LIMIT 1), 
     4),
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Blue Control' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Archaeomancer' LIMIT 1), 
     3);

-- Red Aggro Deck
INSERT INTO "deck_cards" ("deck_id", "card_id", "quantity") 
VALUES 
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Red Aggro' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Lightning Bolt' LIMIT 1), 
     4),
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Red Aggro' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Shivan Dragon' LIMIT 1), 
     2);

-- Green Stompy Deck
INSERT INTO "deck_cards" ("deck_id", "card_id", "quantity") 
VALUES 
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Green Stompy' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Birds of Paradise' LIMIT 1), 
     4),
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Green Stompy' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Llanowar Elves' LIMIT 1), 
     4);

-- White Weenie Deck
INSERT INTO "deck_cards" ("deck_id", "card_id", "quantity") 
VALUES 
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'White Weenie' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Angel of Mercy' LIMIT 1), 
     2),
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'White Weenie' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Ancestor''s Chosen' LIMIT 1), 
     1);

-- Add some multicolor cards to decks
INSERT INTO "deck_cards" ("deck_id", "card_id", "quantity") 
VALUES 
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Blue Control' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Niv-Mizzet, the Firemind' LIMIT 1), 
     1),
    ((SELECT "id" FROM "decks" WHERE "deck_name" = 'Red Aggro' LIMIT 1), 
     (SELECT "id" FROM "cards" WHERE "name" = 'Niv-Mizzet, the Firemind' LIMIT 1), 
     1);

COMMIT; 