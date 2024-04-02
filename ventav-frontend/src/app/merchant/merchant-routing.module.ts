import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantsComponent } from './merchants/merchants.component';
import { AddMerchantsComponent } from './add-merchants/add-merchants.component';
import { ViewMerchantComponent } from './view-merchant/view-merchant.component';

const routes: Routes = [
  {
    path:'',
    component:MerchantsComponent
  },
  {
    path:'add',
    component:AddMerchantsComponent
  },
  {
    path:'edit/:id',
    component:AddMerchantsComponent
  },
  {
    path:'detial/:id',
    component:ViewMerchantComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
