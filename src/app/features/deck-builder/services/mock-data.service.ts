import { Injectable } from '@angular/core';
import { Card, CardListResponseDto, DeckDetailsDto } from '../models/deck.models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  constructor() { }

  /**
   * Generate mock card data for development
   */
  getMockCards(pageIndex: number = 0, pageSize: number = 10): CardListResponseDto {
    const totalCards = this.mockCards.length;
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCards);
    const cards = this.mockCards.slice(startIndex, endIndex);

    return {
      cards,
      pagination: {
        page: pageIndex + 1,
        pageSize: pageSize,
        totalPages: Math.ceil(totalCards / pageSize),
        totalRecords: totalCards
      }
    };
  }

  /**
   * Get a mock deck by ID
   */
  getMockDeck(deckId: number): DeckDetailsDto {
    return {
      id: deckId,
      deckName: 'Sample Deck',
      deckFormat: 'Standard',
      deckDescription: 'A sample deck for testing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: [
        { card: this.mockCards[0], quantity: 4 },
        { card: this.mockCards[1], quantity: 3 },
        { card: this.mockCards[2], quantity: 2 },
        { card: this.mockCards[3], quantity: 1 }
      ],
      statistics: {
        totalCards: 10,
        types: {
          'Creature': 5,
          'Instant': 2,
          'Land': 3
        },
        manaCurve: {
          '1': 2,
          '2': 3,
          '3': 2,
          '4': 2,
          '5': 1
        },
        colors: {
          'White': 4,
          'Blue': 3,
          'Green': 3
        }
      }
    };
  }

  // Array of mock cards
  private mockCards: Card[] = [
    {
      apiId: '1',
      name: 'Llanowar Elves',
      manaCost: '{G}',
      cmc: 1,
      colors: ['G'],
      colorIdentity: ['G'],
      type: 'Creature — Elf Druid',
      types: ['Creature'],
      subtypes: ['Elf', 'Druid'],
      rarity: 'Common',
      set: 'M20',
      setName: 'Core Set 2020',
      text: '{T}: Add {G}.',
      artist: 'Chris Rahn',
      number: '169',
      power: '1',
      toughness: '1',
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=466939&type=card'
    },
    {
      apiId: '2',
      name: 'Counterspell',
      manaCost: '{U}{U}',
      cmc: 2,
      colors: ['U'],
      colorIdentity: ['U'],
      type: 'Instant',
      types: ['Instant'],
      subtypes: null,
      rarity: 'Uncommon',
      set: 'M20',
      setName: 'Core Set 2020',
      text: 'Counter target spell.',
      artist: 'Mark Poole',
      number: '51',
      power: null,
      toughness: null,
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=447175&type=card'
    },
    {
      apiId: '3',
      name: 'Day of Judgment',
      manaCost: '{2}{W}{W}',
      cmc: 4,
      colors: ['W'],
      colorIdentity: ['W'],
      type: 'Sorcery',
      types: ['Sorcery'],
      subtypes: null,
      rarity: 'Rare',
      set: 'M12',
      setName: 'Core Set 2012',
      text: 'Destroy all creatures.',
      artist: 'Vincent Proce',
      number: '12',
      power: null,
      toughness: null,
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=220139&type=card'
    },
    {
      apiId: '4',
      name: 'Breeding Pool',
      manaCost: null,
      cmc: 0,
      colors: null,
      colorIdentity: ['G', 'U'],
      type: 'Land — Forest Island',
      types: ['Land'],
      subtypes: ['Forest', 'Island'],
      rarity: 'Rare',
      set: 'RNA',
      setName: 'Ravnica Allegiance',
      text: '({T}: Add {G} or {U}.)\nAs Breeding Pool enters the battlefield, you may pay 2 life. If you don\'t, it enters the battlefield tapped.',
      artist: 'Daarken',
      number: '246',
      power: null,
      toughness: null,
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=457172&type=card'
    },
    {
      apiId: '5',
      name: 'Jace, the Mind Sculptor',
      manaCost: '{2}{U}{U}',
      cmc: 4,
      colors: ['U'],
      colorIdentity: ['U'],
      type: 'Legendary Planeswalker — Jace',
      types: ['Planeswalker'],
      subtypes: ['Jace'],
      rarity: 'Mythic',
      set: 'WWK',
      setName: 'Worldwake',
      text: '+2: Look at the top card of target player\'s library. You may put that card on the bottom of that player\'s library.\n0: Draw three cards, then put two cards from your hand on top of your library in any order.\n−1: Return target creature to its owner\'s hand.\n−12: Exile all cards from target player\'s library, then that player shuffles their hand into their library.',
      artist: 'Jason Chan',
      number: '31',
      power: null,
      toughness: null,
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=195297&type=card'
    },
    {
      apiId: '6',
      name: 'Lightning Bolt',
      manaCost: '{R}',
      cmc: 1,
      colors: ['R'],
      colorIdentity: ['R'],
      type: 'Instant',
      types: ['Instant'],
      subtypes: null,
      rarity: 'Common',
      set: 'M20',
      setName: 'Core Set 2020',
      text: 'Lightning Bolt deals 3 damage to any target.',
      artist: 'Christopher Rush',
      number: '122',
      power: null,
      toughness: null,
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442050&type=card'
    },
    {
      apiId: '7',
      name: 'Tarmogoyf',
      manaCost: '{1}{G}',
      cmc: 2,
      colors: ['G'],
      colorIdentity: ['G'],
      type: 'Creature — Lhurgoyf',
      types: ['Creature'],
      subtypes: ['Lhurgoyf'],
      rarity: 'Mythic',
      set: 'FUT',
      setName: 'Future Sight',
      text: 'Tarmogoyf\'s power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.',
      artist: 'Ryan Barger',
      number: '153',
      power: '*',
      toughness: '1+*',
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=370404&type=card'
    },
    {
      apiId: '8',
      name: 'Avacyn, Angel of Hope',
      manaCost: '{5}{W}{W}{W}',
      cmc: 8,
      colors: ['W'],
      colorIdentity: ['W'],
      type: 'Legendary Creature — Angel',
      types: ['Creature'],
      subtypes: ['Angel'],
      rarity: 'Mythic',
      set: 'AVR',
      setName: 'Avacyn Restored',
      text: 'Flying, vigilance, indestructible\nOther permanents you control have indestructible.',
      artist: 'Jason Chan',
      number: '6',
      power: '8',
      toughness: '8',
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=239961&type=card'
    },
    {
      apiId: '9',
      name: 'Sol Ring',
      manaCost: '{1}',
      cmc: 1,
      colors: null,
      colorIdentity: [],
      type: 'Artifact',
      types: ['Artifact'],
      subtypes: null,
      rarity: 'Uncommon',
      set: 'C19',
      setName: 'Commander 2019',
      text: '{T}: Add {C}{C}.',
      artist: 'Mike Bierek',
      number: '221',
      power: null,
      toughness: null,
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=470629&type=card'
    },
    {
      apiId: '10',
      name: 'Wrath of God',
      manaCost: '{2}{W}{W}',
      cmc: 4,
      colors: ['W'],
      colorIdentity: ['W'],
      type: 'Sorcery',
      types: ['Sorcery'],
      subtypes: null,
      rarity: 'Rare',
      set: '10E',
      setName: 'Tenth Edition',
      text: 'Destroy all creatures. They can\'t be regenerated.',
      artist: 'Kev Walker',
      number: '61',
      power: null,
      toughness: null,
      layout: 'normal',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129808&type=card'
    }
  ];
} 