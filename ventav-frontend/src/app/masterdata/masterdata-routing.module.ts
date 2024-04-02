import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryComponent } from './industry/industry.component';
import { AddIndustryComponent } from './industry/add-industry/add-industry.component';
import { FirmComponent } from './firm/firm.component';
import { AddFirmComponent } from './firm/add-firm/add-firm.component';
import { RegionsComponent } from './regions/regions.component';
import { AddRegionComponent } from './regions/add-region/add-region.component';
import { CountryComponent } from './country/country.component';
import { AddCountryComponent } from './country/add-country/add-country.component';
import { StateComponent } from './state/state.component';
import { AddStateComponent } from './state/add-state/add-state.component';
import { RolesComponent } from './roles/roles.component';
import { AddRoleComponent } from './roles/add-role/add-role.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AddPermissionComponent } from './permissions/add-permission/add-permission.component';
import { ViewComponent } from './industry/view/view.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { AddTempalteComponent } from './email-template/add-tempalte/add-tempalte.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AddAdminTemplateComponent } from './admin-template/add-admin-template/add-admin-template.component';
import { ViewFirmComponent } from './firm/view/view.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'industries'
  },
  {
    path: 'industries',
    component: IndustryComponent,

  },
  {
    path: 'industries/add',
    component: AddIndustryComponent
  },
  {
    path: 'industries/detial/:id',
    component: ViewComponent
  },
  {
    path: 'industries/edit/:id',
    component: AddIndustryComponent
  },
  {
    path: 'firms',
    component: FirmComponent
  },
  {
    path: 'firms/add',
    component: AddFirmComponent
  },
  {
    path: 'firms/edit/:id',
    component: AddFirmComponent
  },
  {
    path: 'firms/detial/:id',
    component: ViewFirmComponent
  },
  {
    path: 'regions',
    component: RegionsComponent
  },
  {
    path: 'regions/add',
    component: AddRegionComponent
  },
  {
    path: 'regions/edit/:id',
    component: AddRegionComponent
  },
  {
    path: 'countries',
    component: CountryComponent
  },
  {
    path: 'countries/add',
    component: AddCountryComponent
  },
  {
    path: 'countries/edit/:id',
    component: AddCountryComponent
  },
  {
    path: 'states',
    component: StateComponent
  },
  {
    path: 'states/add',
    component: AddStateComponent
  },
  {
    path: 'states/edit/:id',
    component: AddStateComponent
  },
  {
    path: 'email-templates',
    component: EmailTemplateComponent
  },
  {
    path: 'email-templates/:categoryID/add',
    component: AddTempalteComponent
  },
  {
    path: 'email-templates/:categoryID/edit/:id',
    component: AddTempalteComponent
  },
  {
    path: 'admin-templates',
    component: AdminTemplateComponent
  },
  {
    path: 'admin-templates/add',
    component: AddAdminTemplateComponent
  },
  {
    path: 'admin-templates/edit/:id',
    component: AddAdminTemplateComponent
  },
  {
    path: 'email-templates/:categoryID',
    component: EmailTemplateComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  },
  {
    path: 'roles/add',
    component: AddRoleComponent
  },
  {
    path: 'roles/edit/:id',
    component: AddRoleComponent
  },
  {
    path: 'permissions',
    component: PermissionsComponent
  },
  {
    path: 'permissions/add/:id',
    component: AddPermissionComponent
  },
  {
    path: 'permissions/edit/:id',
    component: AddPermissionComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterdataRoutingModule { }
