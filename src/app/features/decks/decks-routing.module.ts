import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecksViewComponent } from './containers/decks-view/decks-view.component';
import { authGuard } from '../../auth/auth.guard'; // Corrected relative path

const routes: Routes = [
  {
    path: '',
    component: DecksViewComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecksRoutingModule { } 