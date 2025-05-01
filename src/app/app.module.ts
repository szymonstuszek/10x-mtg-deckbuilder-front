import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { DeckEffects } from './features/deck-builder/store/deck/deck.effects';
import { cardListReducer } from './features/deck-builder/store/card-list/card-list.reducer';
import { CardListEffects } from './features/deck-builder/store/card-list/card-list.effects';
import { deckReducer } from './features/deck-builder/store/deck/deck.reducer';
import { DeckService } from './features/deck-builder/services/deck.service';
import { CardService } from './features/deck-builder/services/card.service';
import { AuthConfigModule } from './auth/auth-config.module';
import { AuthInterceptor } from './auth/auth-interceptor.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // Material modules
    MatButtonModule,
    MatIconModule,
    
    // Routing
    AppRoutingModule,
    
    // NgRx
    StoreModule.forRoot({}),
    EffectsModule.forRoot([DeckEffects, CardListEffects]),

    StoreModule.forFeature('deckBuilder', {
      deck: deckReducer,
      cardList: cardListReducer
    }),
    // EffectsModule.forFeature([DeckEffects, CardListEffects]),

    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pause recording actions and state changes when the extension window is not open
    }),
    AuthConfigModule
  ],
  providers: [
    DeckService,
    CardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
