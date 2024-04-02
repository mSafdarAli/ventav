import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/_services/rest/roles.service';
import { SystemPermissionsService } from 'src/_services/rest/systemPermissions.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit,OnDestroy {
  roleId: string = '';
  form: FormGroup;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams:Params={};
  permissions = {};
  dataSource = {};
  constructor(
    private formBuilder: FormBuilder,
    private rolesService:RolesService,
    private toaster: ToastrService,
    private router:Router,
    private route:ActivatedRoute,
    private systemPermissionService: SystemPermissionsService
  ) {
    this.form = this.formBuilder.group({
      name: ['',[Validators.required]],
      priority: ['',[Validators.required]],
      permissions: [{},[Validators.required]]
    });
    this.routSub = this.route.params.subscribe((params) => {
      this.roleId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    this.systemPermissionService.getAllPermissions().subscribe({
      next: res => {
        this.dataSource = res['data'].permissions;
      }
    })
    if(this.roleId!=null){
      const sub = this.rolesService.getSingleRole(this.roleId).subscribe({
        next: (res) => {
          this.form.patchValue({
            name:res['data'].name?res['data'].name:'',
            priority:res['data'].priority?res['data'].priority:'',
            permissions:res['data'].permissions?res['data'].permissions:{}
          });
          this.permissions = res['data'].permissions;
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  ngOnInit(): void {
  }
  submit(){
    if(this.form.value){
      if(this.roleId!=null){
        const sub = this.rolesService.updateRole(this.roleId,this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Role Updated Successfully', 'Updated');
            this.router.navigate(['/masterdata/roles'],{queryParams:this.queryParams});
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else{
        const sub = this.rolesService.createRole(this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Role Created Successfully', 'Created');
            this.router.navigate(['/masterdata/roles'],{queryParams:this.queryParams});
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      
    }
  }
  setPermission(component, permission, status) {
    if(this.permissions[component] == undefined) {
      this.permissions[component] = {};
    }
    this.permissions[component][permission] = status.checked;
    this.form.patchValue({permissions: this.permissions});
  }
  getKeys(ob: object): string[] {
    return Object.keys(ob);
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}
