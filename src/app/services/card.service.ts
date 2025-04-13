import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MtGCard {
  name: string;
  manaCost: string;
  type: string;
  description: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor() { }

  getCards(): Observable<MtGCard[]> {
    const cards: MtGCard[] = [
      {
        name: 'Lightning Bolt',
        manaCost: 'R',
        type: 'Instant',
        description: 'Deals 3 damage to any target.',
        imageUrl: 'https://img.scryfall.com/cards/large/en/m10/141.jpg'
      },
      {
        name: 'Counterspell',
        manaCost: 'UU',
        type: 'Instant',
        description: 'Counter target spell.',
        imageUrl: 'https://img.scryfall.com/cards/large/en/leb/21.jpg'
      },
      {
        name: 'Giant Growth',
        manaCost: 'G',
        type: 'Instant',
        description: 'Target creature gets +3/+3 until end of turn.',
        imageUrl: 'https://img.scryfall.com/cards/large/en/m10/117.jpg'
      }
    ];
    return of(cards);
  }
} 