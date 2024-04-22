import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer/customer.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';


@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class CustomerModule { }
