import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendDeckDto, RandomCardResponse } from '../models/deck.model';

@Injectable({
  providedIn: 'root' // Or provide in DecksModule if specific
})
export class DeckService {
  // TODO provide from environment file
  private apiUrl = '/api'; 

  constructor(private http: HttpClient) { }

  getDecks(): Observable<BackendDeckDto[]> {
    return this.http.get<BackendDeckDto[]>(`${this.apiUrl}/decks`);
  }

  getRandomCardImage(deckId: number): Observable<RandomCardResponse> {
    return this.http.get<RandomCardResponse>(`${this.apiUrl}/decks/${deckId}/random`);
  }

  deleteDeck(deckId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/decks/${deckId}`);
  }
} 