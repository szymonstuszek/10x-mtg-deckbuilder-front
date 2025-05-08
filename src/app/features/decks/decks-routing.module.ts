import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DecksViewComponent } from './containers/decks-view/decks-view.component'; // To be created
// import { AuthGuard } from '@app/core/guards/auth.guard'; // Assuming AuthGuard path

const routes: Routes = [
  {
    path: '',
    // component: DecksViewComponent, // To be uncommented when DecksViewComponent is created
    // canActivate: [AuthGuard] // Assuming AuthGuard
    // For now, let's add a placeholder component or leave component empty
    // until DecksViewComponent is ready. For the structure, we'll define the path.
    // Placeholder, actual component will be DecksViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecksRoutingModule { } 