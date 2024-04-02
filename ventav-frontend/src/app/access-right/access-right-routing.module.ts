import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  // {
  //   path:'',
  //   pathMatch:'full',
  //   redirectTo:'list'
  // },
  {
    path:'',
    component:ListComponent
  },
  {
    path:'add-account',
    component:AddAccountComponent
  },
  {
    path:'add',
    component:AddUserComponent
  },
  {
    path:'edit-user/:id',
    component:AddUserComponent
  },
  {
    path:'detail-user/:id',
    component:ViewComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRightRoutingModule { }
