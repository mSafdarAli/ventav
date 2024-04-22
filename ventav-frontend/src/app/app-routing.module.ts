import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NarrowWindowComponent } from './narrow-window/narrow-window.component';
import { AuthGuard } from 'src/_services/auth.guard';
import { FullWindowComponent } from './full-window/full-window.component';

const routes: Routes = [
  {
    path: '',
    component: FullWindowComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: "redeem-coupon",
        loadChildren: () => import('./public/redeem/redeem.module').then(m => m.RedeemModule),
      },
      {
        path: "checkout/:id",
        loadChildren: () => import('./public/checkout/checkout.module').then(m => m.CheckoutModule),
      },
      {
        path: "ticket-preview",
        loadChildren: () => import('./public/ticket-preview/ticket-preview.module').then(m => m.TicketPreviewModule),
      }
    ]
  },
  {
    path: '',
    component: NarrowWindowComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: "masterdata",
        loadChildren: () => import('./masterdata/masterdata.module').then(m => m.MasterdataModule),
        canActivate: [AuthGuard]
      },
      {
        path: "user-management",
        loadChildren: () => import('./access-right/access-right.module').then(m => m.AccessRightModule),
        canActivate: [AuthGuard]
      },
      {
        path: "merchant",
        loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule),
        canActivate: [AuthGuard]
      },
      {
        path: "deals",
        loadChildren: () => import('./deals/deals.module').then(m => m.DealsModule),
        canActivate: [AuthGuard]
      },
      {
        path: "coupons",
        loadChildren: () => import('./coupon/coupon.module').then(m => m.CouponModule),
        canActivate: [AuthGuard]
      },
      {
        path: "tickets",
        loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule),
        canActivate: [AuthGuard]
      },
      {
        path: "profile",
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: "customers",
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
        canActivate: [AuthGuard]
      },
     
     
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
