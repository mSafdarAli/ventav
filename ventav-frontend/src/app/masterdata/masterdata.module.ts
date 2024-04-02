import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterdataRoutingModule } from './masterdata-routing.module';
import { IndustryComponent } from './industry/industry.component';
import { AddIndustryComponent } from './industry/add-industry/add-industry.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { FirmComponent } from './firm/firm.component';
import { AddFirmComponent } from './firm/add-firm/add-firm.component';
import { RegionsComponent } from './regions/regions.component';
import { AddRegionComponent } from './regions/add-region/add-region.component';
import { CountryComponent } from './country/country.component';
import { StateComponent } from './state/state.component';
import { AddStateComponent } from './state/add-state/add-state.component';
import { AddCountryComponent } from './country/add-country/add-country.component';
import { RolesComponent } from './roles/roles.component';
import { AddRoleComponent } from './roles/add-role/add-role.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AddPermissionComponent } from './permissions/add-permission/add-permission.component';
import { ViewComponent } from './industry/view/view.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { AddTempalteComponent } from './email-template/add-tempalte/add-tempalte.component';
import { DetailsComponent } from './email-template/details/details.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AddAdminTemplateComponent } from './admin-template/add-admin-template/add-admin-template.component';
import { ViewFirmComponent } from './firm/view/view.component';
import { RedeemIframeComponent } from './industry/redeem-iframe/redeem-iframe.component';



@NgModule({
  declarations: [
    IndustryComponent,
    AddIndustryComponent,
    FirmComponent,
    AddFirmComponent,
    ViewFirmComponent,
    RegionsComponent,
    AddRegionComponent,
    CountryComponent,
    StateComponent,
    AddStateComponent,
    AddCountryComponent,
    RolesComponent,
    AddRoleComponent,
    PermissionsComponent,
    AddPermissionComponent,
    ViewComponent,
    EmailTemplateComponent,
    AddTempalteComponent,
    DetailsComponent,
    AdminTemplateComponent,
    AddAdminTemplateComponent,
    RedeemIframeComponent
  ],
  imports: [
    CommonModule,
    MasterdataRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class MasterdataModule { }
