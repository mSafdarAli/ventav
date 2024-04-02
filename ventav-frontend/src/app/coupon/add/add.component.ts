import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CouponService } from 'src/_services/rest/coupon.service';
import { ExportCodesComponent } from '../export-codes/export-codes.component';
import { ExportService } from 'src/_services/export.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit,OnDestroy {
  dealId: string = '';
  form: FormGroup;
  couponsCodeForm: FormGroup;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  numberOfCharacters:number;
  queryParams: Params = {};
  couponData:any=[];
  constructor(
    private formBuilder: FormBuilder,
    private couponService: CouponService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private exportservice:ExportService,

  ) {
    this.form = this.formBuilder.group({
      noOfCoupons: ['', [Validators.required]],
      alphanumeric: [false, [Validators.required]],
      firstLetter: [null],
      codeLength: [0]
    });
    this.couponsCodeForm = this.formBuilder.group({
      date: ['', [Validators.required]]
    });
    this.routSub = this.route.params.subscribe((params) => {
      this.dealId = params['dealId'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    // if (this.countryId != null) {
    //   const sub = this.countryService.getSingleCountry(this.countryId).subscribe({
    //     next: (res) => {
    //       this.form.patchValue({
    //         name: res['data'].name ? res['data'].name : '',
    //         iso3: res['data'].iso3 ? res['data'].iso3 : '',
    //         phone_code: res['data'].phone_code ? res['data'].phone_code : '',
    //         capital: res['data'].capital ? res['data'].capital : '',
    //         currency: res['data'].currency ? res['data'].currency : ''
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
  checkBoolean(value) {
    if (value) {
      return true;
    }
    return false;
  }
  coutCharacter(event){
    this.numberOfCharacters = event.target.value.length;
  }
  submit(){
    if(this.form.valid){
      const data=Object.assign({},this.form.value);
      data.dealId=this.dealId;
      if(this.dealId!=null){
        const sub = this.couponService.createCoupon(data).subscribe({
          next: (res) => {
            this.toaster.success('Coupons Generarted Successfully', 'Success');
            this.router.navigate(['/coupons'],{queryParams:this.queryParams});
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
  getCouponsCode() {
    if (this.couponsCodeForm.valid) {
      const data = Object.assign({}, this.couponsCodeForm.value);
      data.dealId =this.dealId;
      data.date = changeDateToApiFormat(data.date);
      const sub = this.couponService.getCouponCodes(data).subscribe({
        next: (res) => {
          this.couponData=res['data'];
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    else {
      this.couponsCodeForm.markAllAsTouched();
    }
  }
  exportCoupons(){
    this.exportservice.exportCoupons(this.couponData);
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}