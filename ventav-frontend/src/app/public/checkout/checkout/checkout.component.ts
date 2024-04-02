import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { CheckoutService } from 'src/_services/rest/checkout.service';
import { CouponService } from 'src/_services/rest/coupon.service';
import { IndustryService } from 'src/_services/rest/industry.service';
import { LookUpService } from 'src/_services/rest/lookup.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  routSub: Subscription = null;
  dealId: string;
  selectTicket:lookupdata[]=[];
  selectState:lookupdata[]=[];
  selectRegion:lookupdata[]=[];
  selectCardType:lookupdata[]=[];
  logo:any;
  title: string;
  questions: any[] = [];
  answers: any[] = [];
  data:any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private lookupService:LookUpService
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.dealId = params['id'];
    });
    this.form = this.formBuilder.group({
      ticketQuantity: ['', [Validators.required]],
      stateIds: ['', [Validators.required]],
      regionIds: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      cardType: ['', [Validators.required]],
      cardNo: ['', [Validators.required]],
      cardExpiry: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      discountCode: [''],
    });
    
  }

  ngOnInit(): void {
    this.getStatesLookup();
    this.selectCardType=this.lookupService.getCardType();
    if(this.dealId){
      const sub = this.checkoutService.getDealDetails(this.dealId).subscribe({
        next: (res) => {
          this.data=res['data'];
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }
  getStatesLookup(){
    const sub = this.lookupService.getAllStates().subscribe({
      next: (res) => {
        this.selectState=res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  
  getRegionByStateId(stateId){
    const sub = this.lookupService.getRegionByStateId(stateId).subscribe({
      next: (res) => {
        this.selectRegion=res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  customStyle(buttonColorValue=null,textColorValue=null) {
    return {
      background: buttonColorValue ? buttonColorValue : '#0D6EFD',
      color: textColorValue ? textColorValue : '#fff',
    }
  }
 
  submit() {
    // if (this.form.valid) {
    //   const data = Object.assign({}, this.form.value);
    //   data.answers = this.answers;
    //   delete data.answer;
    //   const sub = this.couponService.redeemCoupon(data).subscribe({
    //     next: (res) => {
          
    //       sub.unsubscribe();
    //     },
    //     error: (res) => {
    //       sub.unsubscribe();
    //     },
    //   });
    // }
    // else {
    //   this.form.markAllAsTouched();
    // }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }

}
