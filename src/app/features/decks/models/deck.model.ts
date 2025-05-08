export interface DeckMeta {
  id: number;
  deckName: string;
  deckFormat: string;
  representativeImageUrl: string | null;
}

export interface RandomCardResponse {
  card: {
    imageUrl: string | null;
  } | null;
}

export interface BackendDeckDto {
  id: number;
  deck_name: string; // Or deckName if backend uses camelCase
  deck_format: string;
  deck_description: string | null;
  created_at: string;
  updated_at: string;
} 