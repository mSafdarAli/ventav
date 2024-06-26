import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewComponent } from './preview/preview.component';
import { PrintComponent } from './print/print.component';

const routes: Routes = [
  {
    path:'',
    component:PreviewComponent
  },
  {
    path:'print',
    component:PrintComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketPreviewRoutingModule { }
