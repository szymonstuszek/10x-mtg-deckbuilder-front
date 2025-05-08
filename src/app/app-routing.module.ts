import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./features/deck-builder/deck-builder.module').then(m => m.DeckBuilderModule),
    data: { animation: 'isLeft' }
  },
  {
    path: 'decks',
    loadChildren: () => import('./features/decks/decks.module').then(m => m.DecksModule),
    data: { animation: 'isRight' }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 