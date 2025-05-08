import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecksRoutingModule } from './decks-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDecks from './store/decks.reducer';
import { DecksEffects } from './store/decks.effects';

// Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // For error notifications

// Components
import { DecksViewComponent } from './containers/decks-view/decks-view.component';
import { DeckCardComponent } from './components/deck-card/deck-card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    DecksViewComponent,
    DeckCardComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    DecksRoutingModule,
    StoreModule.forFeature(fromDecks.decksFeatureKey, fromDecks.reducer),
    EffectsModule.forFeature([DecksEffects]),
    // Material Modules
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class DecksModule { } 