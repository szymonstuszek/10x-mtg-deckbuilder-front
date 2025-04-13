import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppModule } from './app.module';
import { CardTableComponent } from './card-table/card-table.component';

@Component({
  selector: 'app-root',
  imports: [CardTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dev10x-mtg-deckbuilder';
}
