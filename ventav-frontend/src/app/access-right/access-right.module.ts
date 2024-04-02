import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessRightRoutingModule } from './access-right-routing.module';
import { ListComponent } from './list/list.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { AddAccountComponent } from './add-account/add-account.component';
import { AddUserComponent } from './add-user/add-user.component';


@NgModule({
  declarations: [
    ListComponent,
    AddAccountComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    AccessRightRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class AccessRightModule { }
