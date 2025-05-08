import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendDeckDto, RandomCardResponse } from '../models/deck.model';
import { environment } from '../../../../environments/environment'; // Corrected relative path

@Injectable({
  providedIn: 'root' // Or provide in DecksModule if specific
})
export class DeckService {
  private apiUrlBase = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDecks(): Observable<BackendDeckDto[]> {
    return this.http.get<BackendDeckDto[]>(`${this.apiUrlBase}/decks`);
  }

  getRandomCardImage(deckId: number): Observable<RandomCardResponse> {
    return this.http.get<RandomCardResponse>(`${this.apiUrlBase}/decks/${deckId}/random`);
  }

  deleteDeck(deckId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlBase}/decks/${deckId}`);
  }
} 