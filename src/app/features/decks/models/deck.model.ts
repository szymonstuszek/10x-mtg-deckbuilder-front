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
  deckName: string;
  deckFormat: string;
  deckDescription: string | null;
  createdAt: string;
  updatedAt: string;
} 