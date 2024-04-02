import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedeemCouponComponent } from './redeem-coupon/redeem-coupon.component';

const routes: Routes = [
  {
    path:':id',
    component:RedeemCouponComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedeemRoutingModule { }
