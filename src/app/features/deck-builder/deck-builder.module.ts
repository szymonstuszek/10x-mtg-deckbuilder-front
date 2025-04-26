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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';

// Store imports
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Component imports
import { DeckBuilderViewComponent } from './components/deck-builder-view/deck-builder-view.component';
import { DeckHeaderComponent } from './components/deck-header/deck-header.component';
import { DeckSummaryComponent } from './components/deck-summary/deck-summary.component';
import { CardSearchFilterComponent } from './components/card-search-filter/card-search-filter.component';
import { CardTableComponent } from './components/card-table/card-table.component';
import { CardGroupComponent } from './components/card-group/card-group.component';
import { CardItemComponent } from './components/card-item/card-item.component';
import { CardImagePopoverDirective } from './directives/card-image-popover.directive';

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
    DeckHeaderComponent,
    DeckSummaryComponent,
    CardSearchFilterComponent,
    CardTableComponent,
    CardGroupComponent,
    CardItemComponent,
    CardImagePopoverDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    OverlayModule,
    
    // Material modules
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    
    // Store modules
    // StoreModule.forFeature('deckBuilder', {
    //   deck: deckReducer,
    //   cardList: cardListReducer
    // }),
    // EffectsModule.forFeature([DeckEffects, CardListEffects])
  ]
})
export class DeckBuilderModule { } 