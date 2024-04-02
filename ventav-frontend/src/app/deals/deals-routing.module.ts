import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealComponent } from './deal/deal.component';
import { AddDealComponent } from './deal/add-deal/add-deal.component';
import { ViewDealComponent } from './deal/view-deal/view-deal.component';

const routes: Routes = [
  {
    path:'',
    component:DealComponent
  },
  {
    path:'add',
    component:AddDealComponent
  },
  {
    path:'edit/:id',
    component:AddDealComponent
  },
  {
    path:'detial/:id',
    component:ViewDealComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealsRoutingModule { }
