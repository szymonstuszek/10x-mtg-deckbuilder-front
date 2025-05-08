import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecksRoutingModule } from './decks-routing.module';
// Import NgRx related modules when state management is set up
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import * as fromDecks from './store/decks.reducer';
// import { DecksEffects } from './store/decks.effects';

// Components will be declared here later
// import { DecksViewComponent } from './containers/decks-view/decks-view.component';
// import { DeckCardComponent } from './components/deck-card/deck-card.component';

@NgModule({
  declarations: [
    // DecksViewComponent,
    // DeckCardComponent
  ],
  imports: [
    CommonModule,
    DecksRoutingModule,
    // StoreModule.forFeature(fromDecks.decksFeatureKey, fromDecks.reducer),
    // EffectsModule.forFeature([DecksEffects])
  ]
})
export class DecksModule { } 