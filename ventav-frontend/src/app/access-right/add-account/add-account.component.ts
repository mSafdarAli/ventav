import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { UserService } from 'src/_services/rest/user.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit ,OnDestroy{
  showPassword: boolean = false
  accountId: string = '';
  form: FormGroup;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  logo='';
  payloadLogo:any[]=[];
  selectTicketTemplate:lookupdata[]=[];
  selectPrivileges:lookupdata[]=[];
  selectTimeZone:lookupdata[]=[];
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
      compnay: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      preferredUrl: ['', [Validators.required]],
      ticketTemplate: ['', [Validators.required]],
      privileges: ['', [Validators.required]],
      approved: ['', [Validators.required]],
      timeZone: ['', [Validators.required]]
    });
    this.selectTimeZone=this.lookupService.getTimeZone();
    this.selectPrivileges=this.lookupService.getPrivileges();
    this.routSub = this.route.params.subscribe((params) => {
      this.accountId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    // if (this.accountId != null) {
    //   const sub = this.userService.getSingleAccount(this.accountId).subscribe({
    //     next: (res) => {
    //       this.form.patchValue({
    //         name: res['data'].name ? res['data'].name : '',
    //         compnay: res['data'].compnay ? res['data'].compnay : '',
    //         email: res['data'].email ? res['data'].email : '',
    //         preferredUrl: res['data'].preferredUrl ? res['data'].preferredUrl : '',
    //         ticketTemplate: res['data'].ticketTemplate ? res['data'].ticketTemplate : '',
    //         privileges: res['data'].privileges ? res['data'].privileges : '',
    //         approved: res['data'].approved ? res['data'].approved : '',
    //         timeZone: res['data'].timeZone ? res['data'].timeZone : ''
    //       })
    //       sub.unsubscribe();
    //     },
    //     error: (res) => {
    //       sub.unsubscribe();
    //     },
    //   });
    // }
  }

  ngOnInit(): void {
  }
  getTicketTemplates(){
    const sub = this.lookupService.getTicketTemplate().subscribe({
      next: (res) => {
        this.selectTicketTemplate=res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  uploadLogo(event) {
    const file = event.target.files[0];
    this.payloadLogo.push(file);

    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.logo = event.target.result;
      };
      reader.readAsDataURL(event.target.files[index]);
    }
  }
  removeLogo() {
    this.logo='';
  }
  submit(){
    // if(this.form.value){
    //   if(this.accountId!=null){
    //     const sub = this.userService.updateAccount(this.accountId,this.payloadLogo,this.form.value).subscribe({
    //       next: (res) => {
    //         this.toaster.success('Country Updated Successfully', 'Updated');
    //         this.router.navigate(['/masterdata/countries'],{queryParams:this.queryParams});
    //         sub.unsubscribe();
    //       },
    //       error: (res) => {
    //         sub.unsubscribe();
    //       },
    //     });
    //   }
    //   else{
    //     const sub = this.userService.createAccount(this.payloadLogo,this.form.value).subscribe({
    //       next: (res) => {
    //         this.toaster.success('Country Created Successfully', 'Created');
    //         this.router.navigate(['/masterdata/countries'],{queryParams:this.queryParams});
    //         sub.unsubscribe();
    //       },
    //       error: (res) => {
    //         sub.unsubscribe();
    //       },
    //     });
    //   }
      
    // }
    // else{
    //   this.form.markAllAsTouched();
    // }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}

