import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Card, PaginationState } from '../../models/deck.models';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() cards: Card[] = [];
  @Input() pagination?: PaginationState;
  @Input() isLoading = false;
  
  @Output() addCard = new EventEmitter<Card>();
  @Output() pageChanged = new EventEmitter<PageEvent>();
  @Output() sortChanged = new EventEmitter<Sort>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  // Table configuration
  displayedColumns: string[] = ['name', 'type', 'set', 'rarity', 'manaCost', 'actions'];
  dataSource = new MatTableDataSource<Card>([]);
  
  constructor() { }

  ngOnInit(): void {
    // Initialize table data source
    this.updateDataSource();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Update data source when cards input changes
    if (changes['cards']) {
      this.updateDataSource();
    }
  }
  
  ngAfterViewInit(): void {
    // Connect the sort component
    this.dataSource.sort = this.sort;
    
    // Listen to sort events
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.onSortChanged(sort);
    });
  }
  
  // Update the data source with the cards input
  private updateDataSource(): void {
    this.dataSource.data = this.cards;
  }
  
  // Add a card to the deck
  onAddCard(card: Card): void {
    this.addCard.emit(card);
  }
  
  // Handle pagination events
  onPageChanged(event: PageEvent): void {
    this.pageChanged.emit(event);
  }
  
  // Handle sort events
  onSortChanged(sort: Sort): void {
    this.sortChanged.emit(sort);
  }
  
  // Check if a card has a color
  hasColor(colors: string[] | null): boolean {
    return !!colors && colors.length > 0;
  }
  
  // Get a color class for the card based on its colors
  getColorClass(colors: string[] | null): string {
    if (!colors || colors.length === 0) {
      return 'colorless';
    }
    
    if (colors.length > 1) {
      return 'multicolor';
    }
    
    switch (colors[0]) {
      case 'W': return 'white';
      case 'U': return 'blue';
      case 'B': return 'black';
      case 'R': return 'red';
      case 'G': return 'green';
      default: return 'colorless';
    }
  }
} 