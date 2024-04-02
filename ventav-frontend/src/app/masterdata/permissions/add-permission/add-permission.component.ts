import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SystemPermissionsService } from 'src/_services/rest/systemPermissions.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss']
})
export class AddPermissionComponent implements OnInit {
  form: FormGroup;
  id: string = '';
  dataSource = {};
  constructor(
    private formBuilder: FormBuilder,
    private systemPermission: SystemPermissionsService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      component: ['', [Validators.required]],
      permission: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.getAllPermissions();
  }
  getAllPermissions() {
    const sub = this.systemPermission.getAllPermissions().subscribe({
      next: (res) => {
        this.id = res['data']._id;
        this.dataSource = res['data'].permissions;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  submit() {
    if (this.form.value) {
      const sub = this.systemPermission.createPermission(this.id,this.form.value).subscribe({
        next: (res) => {
          this.toaster.success('Permission Created Successfully', 'Created');
          this.router.navigate(['/masterdata/permissions']);
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }
  getKeys(ob: object): string[] {
    return Object.keys(ob);
  }
}
