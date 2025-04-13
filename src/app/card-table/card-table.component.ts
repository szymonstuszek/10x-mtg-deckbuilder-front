import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CardService, MtGCard } from '../services/card.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-card-table',
  imports: [MatTableModule, CommonModule],
  templateUrl: './card-table.component.html'
})
export class CardTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'manaCost', 'type', 'description', 'imageUrl'];
  dataSource = new MatTableDataSource<MtGCard>();

  constructor(private cardService: CardService) { }

  ngOnInit(): void {
    this.cardService.getCards().subscribe((data: MtGCard[]) => {
      this.dataSource.data = data;
    });
  }
}



