import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CardFilters, CardListResponseDto, PaginationState, SortState } from '../models/deck.models';
import { environment } from '../../../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = environment.apiUrl;
  // temp use mock data in development
  private useMockData = environment.production; // Use mock data in development

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }

  /**
   * Get a list of cards based on filters, pagination, and sorting
   * @param filters Card filters
   * @param pagination Pagination state
   * @param sort Sorting state
   */
  getCards(
    filters: CardFilters,
    pagination: PaginationState,
    sort: SortState
  ): Observable<CardListResponseDto> {
    // Use mock data in development
    if (this.useMockData) {
      console.log('Using mock card data');
      return of(this.mockDataService.getMockCards(pagination.pageIndex, pagination.pageSize));
    }

    // Convert 0-based pageIndex to 1-based page for API
    const page = pagination.pageIndex + 1;
    const pageSize = pagination.pageSize;
    
    // Build query params
    let params = new HttpParams()
      .set('page', page.toString())
      // .set('pageSize', pageSize.toString())
      ;
    
    // Add sort parameters if provided
    if (sort.active && sort.direction) {
      params = params
        .set('sort', sort.active)
        .set('order', sort.direction);
    }
    
    // Add filter parameters if provided
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    
    if (filters.set) {
      params = params.set('set', filters.set);
    }
    
    if (filters.rarity && filters.rarity.length > 0) {
      // Join multiple values with comma
      params = params.set('rarity', filters.rarity.join(','));
    }
    
    if (filters.color && filters.color.length > 0) {
      params = params.set('color', filters.color.join(','));
    }
    
    if (filters.type && filters.type.length > 0) {
      params = params.set('type', filters.type.join(','));
    }
    
    if (filters.manaCost !== null) {
      params = params.set('cmc', filters.manaCost.toString());
    }
    
    return this.http.get<CardListResponseDto>(`${this.apiUrl}/cards`, { params });
  }
} 