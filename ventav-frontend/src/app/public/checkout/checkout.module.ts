import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormControllerModule } from 'src/app/shared/form-controller/form-controller.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';


@NgModule({
  declarations: [
    CheckoutComponent,
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    FormControllerModule
  ]
})
export class CheckoutModule { }
