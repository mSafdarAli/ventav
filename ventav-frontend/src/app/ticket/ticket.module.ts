import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { ListComponent } from './list/list.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class TicketModule { }
