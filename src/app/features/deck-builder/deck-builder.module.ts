import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// Store imports
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Component imports
import { DeckBuilderViewComponent } from './components/deck-builder-view/deck-builder-view.component';
// The following components will be created in future steps:
// import { DeckHeaderComponent } from './components/deck-header/deck-header.component';
// import { DeckSummaryComponent } from './components/deck-summary/deck-summary.component';
// import { CardGroupComponent } from './components/card-group/card-group.component';
// import { CardItemComponent } from './components/card-item/card-item.component';
// import { CardSearchFilterComponent } from './components/card-search-filter/card-search-filter.component';
// import { CardTableComponent } from './components/card-table/card-table.component';
// import { CardImagePopoverDirective } from './directives/card-image-popover.directive';

// Reducers and Effects
import { deckReducer } from './store/deck/deck.reducer';
import { cardListReducer } from './store/card-list/card-list.reducer';
import { DeckEffects } from './store/deck/deck.effects';
import { CardListEffects } from './store/card-list/card-list.effects';

// Services
import { DeckService } from './services/deck.service';
import { CardService } from './services/card.service';

const routes: Routes = [
  {
    path: '',
    component: DeckBuilderViewComponent
  },
  {
    path: 'decks/:deckId',
    component: DeckBuilderViewComponent
  }
];

@NgModule({
  declarations: [
    DeckBuilderViewComponent,
    // The following components will be declared once implemented:
    // DeckHeaderComponent,
    // DeckSummaryComponent,
    // CardGroupComponent,
    // CardItemComponent,
    // CardSearchFilterComponent,
    // CardTableComponent,
    // CardImagePopoverDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    
    // Material modules
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    
    // Store modules
    StoreModule.forFeature('deckBuilder', {
      deck: deckReducer,
      cardList: cardListReducer
    }),
    EffectsModule.forFeature([DeckEffects, CardListEffects])
  ],
  providers: [
    DeckService,
    CardService
  ]
})
export class DeckBuilderModule { } 