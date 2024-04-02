import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { MustMatch } from 'src/_services/must-match.validator';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { UserService } from 'src/_services/rest/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit,OnDestroy {
  showPassword: boolean = false
  confirmPassword: boolean = false
  userId: string = '';
  form: FormGroup;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  selectRoles:lookupdata[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService:LookUpService
  ) { 
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      active: [true, [Validators.required]],
      roleId: ['', [Validators.required]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.routSub = this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    if (this.userId != null) {
      this.form.controls['password'].clearValidators();
      this.form.controls['confirmPassword'].clearValidators();
      const sub = this.userService.getSingleUser(this.userId).subscribe({
        next: (res) => {
          this.form.patchValue({
            name: res['data'].name ? res['data'].name : '',
            email: res['data'].email ? res['data'].email : '',
            active: res['data'].active ? res['data'].active : false,
            roleId: res['data'].roleId ? res['data'].roleId : ''
          })
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  ngOnInit(): void {
    this.getAllRoles();
  }
  getAllRoles(){
    const sub = this.lookupService.getAllRoles().subscribe({
      next: (res) => {
        this.selectRoles=res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  submit(){
    if(this.form.value){
      if(this.userId!=null){
        const data=Object.assign({},this.form.value);
        delete data.password;
        delete data.confirmPassword;
        const sub = this.userService.updateUser(this.userId,data).subscribe({
          next: (res) => {
            this.toaster.success('User Updated Successfully', 'Updated');
            this.router.navigate(['/user-management'],{queryParams:this.queryParams});
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else{
        const data=Object.assign({},this.form.value);
        delete data.confirmPassword;
        const sub = this.userService.createUser(data).subscribe({
          next: (res) => {
            this.toaster.success('User Created Successfully', 'Created');
            this.router.navigate(['/user-management'],{queryParams:this.queryParams});
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      
    }
    else{
      this.form.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}
