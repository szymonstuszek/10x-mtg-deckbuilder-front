import { DeckMeta } from '../models/deck.model';

export interface DecksState {
  decks: DeckMeta[];
  isLoading: boolean;
  error: string | null;
}

export const initialDecksState: DecksState = {
  decks: [],
  isLoading: false,
  error: null,
}; 