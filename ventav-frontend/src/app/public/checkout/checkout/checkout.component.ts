import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { CheckoutService } from 'src/_services/rest/checkout.service';
import { CouponService } from 'src/_services/rest/coupon.service';
import { IndustryService } from 'src/_services/rest/industry.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit,OnDestroy {
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
  price:number=0;
  appliedDiscount:number=0;
  discountError:boolean=false;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private lookupService:LookUpService,
    private toaster: ToastrService,
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.dealId = params['id'];
    });
    this.form = this.formBuilder.group({
      ticketQuantity: ['', [Validators.required]],
      stateIds: ['', [Validators.required]],
      regionIds: ['', [Validators.required]],
      firstName: ['', [Validators.required,Validators.maxLength(50)]],
      lastName: ['', [Validators.required,Validators.maxLength(50)]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.maxLength(25)]],
      dob: ['', [Validators.required]],
      cardType: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      cardExpiry: ['', [Validators.required]],
      securityCode: ['', [Validators.required]],
      address: ['', [Validators.required,Validators.maxLength(50)]],
      city: ['', [Validators.required,Validators.maxLength(40)]],
      stateId: ['', [Validators.required]],
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
    const sub = this.lookupService.getAllStatesCheckout().subscribe({
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
    const sub = this.lookupService.getRegionByStateIdCheckout(stateId).subscribe({
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
  ticketPrices(quantity){
    this.price=this.data.customerPrice*quantity;
  }
  checkForDiscount(value){ 
   const filtered=this.data.discountCodes.find(x=>x.newDiscount==value);
    if(filtered){
      this.price=this.price-(this.price*filtered.newDiscountPercentage)/100;
          this.appliedDiscount=filtered.newDiscountPercentage;
    }
    else{
      this.ticketPrices(this.form.value.ticketQuantity);
      this.appliedDiscount=0;
      this.discountError=true;
    }
  }
  
  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.dealId = this.dealId;
      data.expiryMonth=data.cardExpiry.split('/')[0];
      data.expiryYear=data.cardExpiry.split('/')[1];
      data.amount=this.price;
      data.dob=changeDateToApiFormat(data.dob);
      const sub = this.checkoutService.checkout(data).subscribe({
        next: (res) => {
          this.toaster.success('Payment Successfull', 'Payment');
          // this.form.reset();
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }
  checkCvv(number) {
    if (String(number).length< 3) {
			this.form.controls['securityCode'].setErrors({ customMin: true });
		}
    else if(String(number).length> 4){
      this.form.controls['securityCode'].setErrors({ customMax: true });
    } 
  }
  checkCardNumber(number) {
    if (String(number).length< 13) {
			this.form.controls['cardNumber'].setErrors({ minCardNumber: true });
		}
    else if(String(number).length> 16){
      this.form.controls['cardNumber'].setErrors({ maxCardNumber: true });
    } 
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }

}
