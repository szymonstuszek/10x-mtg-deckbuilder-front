import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreateDeckRequestDto, DeckDetailsDto, DeckDto, UpdateDeckRequestDto } from '../models/deck.models';
import { environment } from '../../../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private apiUrl = environment.apiUrl;
  // todo revert - testing
  private useMockData = environment.production; // Use mock data in development

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }

  /**
   * Get a list of all decks for the current user
   */
  getDecks(): Observable<DeckDto[]> {
    if (this.useMockData) {
      console.log('Using mock deck list data');
      // Mock a simple list of decks
      return of([
        {
          id: 1,
          deckName: 'Sample Deck 1',
          deckFormat: 'Standard',
          deckDescription: 'A sample deck for testing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          deckName: 'Sample Deck 2',
          deckFormat: 'Standard',
          deckDescription: 'Another sample deck',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    }
    
    return this.http.get<DeckDto[]>(`${this.apiUrl}/decks`);
  }

  /**
   * Get detailed information for a specific deck
   * @param deckId The ID of the deck to retrieve
   */
  getDeckById(deckId: number): Observable<DeckDetailsDto> {
    if (this.useMockData) {
      console.log('Using mock deck details data');
      return of(this.mockDataService.getMockDeck(deckId));
    }
    
    return this.http.get<DeckDetailsDto>(`${this.apiUrl}/decks/${deckId}`);
  }

  /**
   * Create a new deck
   * @param deck The deck data to create
   */
  createDeck(deck: CreateDeckRequestDto): Observable<DeckDto> {
    if (this.useMockData) {
      console.log('Mock creating new deck');
      // todo we might let the backend generate the id
      return of({
        id: Math.floor(Math.random() * 1000) + 10, // Generate a random ID
        deckName: deck.deckName,
        deckFormat: deck.deckFormat,
        deckDescription: deck.deckDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return this.http.post<DeckDto>(`${this.apiUrl}/decks`, deck);
  }

  /**
   * Update an existing deck
   * @param deckId The ID of the deck to update
   * @param deck The updated deck data
   */
  updateDeck(deckId: number, deck: UpdateDeckRequestDto): Observable<DeckDto> {
    if (this.useMockData) {
      console.log('Mock updating deck', deckId);
      return of({
        id: deckId,
        deckName: deck.deckName,
        deckFormat: 'Standard', // Format is not updated in the API
        deckDescription: deck.deckDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return this.http.put<DeckDto>(`${this.apiUrl}/decks/${deckId}`, deck);
  }

  /**
   * Delete a deck
   * @param deckId The ID of the deck to delete
   */
  deleteDeck(deckId: number): Observable<void> {
    if (this.useMockData) {
      console.log('Mock deleting deck', deckId);
      return of(void 0);
    }
    
    return this.http.delete<void>(`${this.apiUrl}/decks/${deckId}`);
  }
} 