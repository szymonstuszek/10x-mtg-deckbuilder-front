import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateDeckRequestDto, DeckDetailsDto, DeckDto, UpdateDeckRequestDto } from '../models/deck.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Get a list of all decks for the current user
   */
  getDecks(): Observable<DeckDto[]> {
    return this.http.get<DeckDto[]>(`${this.apiUrl}/decks`);
  }

  /**
   * Get detailed information for a specific deck
   * @param deckId The ID of the deck to retrieve
   */
  getDeckById(deckId: number): Observable<DeckDetailsDto> {
    return this.http.get<DeckDetailsDto>(`${this.apiUrl}/decks/${deckId}`);
  }

  /**
   * Create a new deck
   * @param deck The deck data to create
   */
  createDeck(deck: CreateDeckRequestDto): Observable<DeckDto> {
    return this.http.post<DeckDto>(`${this.apiUrl}/decks`, deck);
  }

  /**
   * Update an existing deck
   * @param deckId The ID of the deck to update
   * @param deck The updated deck data
   */
  updateDeck(deckId: number, deck: UpdateDeckRequestDto): Observable<DeckDto> {
    return this.http.put<DeckDto>(`${this.apiUrl}/decks/${deckId}`, deck);
  }

  /**
   * Delete a deck
   * @param deckId The ID of the deck to delete
   */
  deleteDeck(deckId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/decks/${deckId}`);
  }
} 