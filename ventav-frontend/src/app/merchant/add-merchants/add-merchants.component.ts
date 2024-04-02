import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { AuthService } from 'src/_services/auth.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { MerchantService } from 'src/_services/rest/merchant.service';

@Component({
  selector: 'app-add-merchants',
  templateUrl: './add-merchants.component.html',
  styleUrls: ['./add-merchants.component.scss']
})
export class AddMerchantsComponent implements OnInit ,OnDestroy{

  showPassword: boolean = false
  merchantId: string = '';
  form: FormGroup;
  selectState: lookupdata[] = [];
  selectStates: lookupdata[] = [];
  selectPromotor: lookupdata[] = [];
  selectStatus: lookupdata[] = [];
  selectIndustry: lookupdata[] = [];
  selectRegion: lookupdata[] = [];
  selectPosition: lookupdata[] = [];
  registedStates: any[] = [];
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  roleName: string='';
  roleId: string='';
  constructor(
    private formBuilder: FormBuilder,
    private lookupService: LookUpService,
    private merchantService: MerchantService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _authService:AuthService
  ) {
    this.form = this.formBuilder.group({
      stateId: ['', [Validators.required]],
      stateIds: ['', [Validators.required]],
      regionIds: ['', [Validators.required]],
      industryId: ['', [Validators.required]],
      promoterId: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      position: ['', [Validators.required]],
      status: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      contactEmail: ['', [Validators.required,Validators.email]],
      contactPassword: ['', [Validators.required]],
      merchantText: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      website: ['', [Validators.required]],
      revenue: ['', [Validators.required]],
      emailRemainingTimes: ['', [Validators.required]],
      communicationEmail: ['', [Validators.required,Validators.email]],
      active: [true]
    });
    this.roleName=this._authService.userDetails.role.name;
    this.roleId=this._authService.userDetails._id;
    this.routSub = this.route.params.subscribe((params) => {
      this.merchantId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    if (this.merchantId != null) {
      const sub = this.merchantService.getSingleMerchant(this.merchantId).subscribe({
        next: (res) => {
          this.getRegionByStateId(res['data'].stateIds);
          this.form.patchValue({
            stateId: res['data'].stateId ? res['data'].stateId : '',
            stateIds: res['data'].stateIds ? res['data'].stateIds : '',
            regionIds: res['data'].regionIds ? res['data'].regionIds : '',
            industryId: res['data'].industryId ? res['data'].industryId : '',
            promoterId: res['data'].promoterId ? res['data'].promoterId : '',
            street: res['data'].street ? res['data'].street : '',
            city: res['data'].city ? res['data'].city : '',
            zipCode: res['data'].zipCode ? res['data'].zipCode : '',
            email: res['data'].email ? res['data'].email : '',
            name: res['data'].name ? res['data'].name : '',
            phone: res['data'].phone ? res['data'].phone : '',
            position: res['data'].position ? res['data'].position : '',
            status: res['data'].status ? res['data'].status : '',
            contactName: res['data'].contactName ? res['data'].contactName : '',
            contactEmail: res['data'].contactEmail ? res['data'].contactEmail : '',
            contactPassword: res['data'].contactPassword ? res['data'].contactPassword : '',
            merchantText: res['data'].merchantText ? res['data'].merchantText : '',
            notes: res['data'].notes ? res['data'].notes : '',
            website: res['data'].website ? res['data'].website : '',
            revenue: res['data'].revenue ? res['data'].revenue : '',
            emailRemainingTimes: res['data'].emailRemainingTimes ? res['data'].emailRemainingTimes : '',
            communicationEmail: res['data'].communicationEmail ? res['data'].communicationEmail : '',
            active: res['data'].active ? res['data'].active : false
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
    this.getAllStates();
    this.getAllIndustries();
    this.getAllPromoters();
    this.selectStatus = this.lookupService.getMerchantStatus();
    this.selectPosition = this.lookupService.getMerchantPosition();
  }
  getAllStates() {
    const sub = this.lookupService.getAllStates().subscribe({
      next: (res) => {
        this.selectState = res['data'];
        this.selectStates = res['data'];

        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllIndustries() {
    const sub = this.lookupService.getAllIndustries().subscribe({
      next: (res) => {
        this.selectIndustry = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getRegionByStateId(state) {
    const sub = this.lookupService.getRegionByStateId(state).subscribe({
      next: (res) => {
        this.selectRegion = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllPromoters() {
    const sub = this.lookupService.getAllPromoters().subscribe({
      next: (res) => {
        this.selectPromotor = res['data'];
        if(this.roleName=='Promoter'){
          this.form.patchValue({
            promoterId:this.roleId
          });
        }
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  submit() {
    if (this.form.valid) {
      if (this.merchantId != null) {
        const sub = this.merchantService.updateMerchant(this.merchantId, this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Merchant Updated Successfully', 'Updated');
            this.router.navigate(['/merchant'], { queryParams: this.queryParams });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.merchantService.createMerchant(this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Merchant Created Successfully', 'Created');
            this.router.navigate(['/merchant'], { queryParams: this.queryParams });
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
