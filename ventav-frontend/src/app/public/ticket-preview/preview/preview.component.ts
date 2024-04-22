import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { TicketService } from 'src/_services/rest/ticket.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  imageUrl: string = 'assets/images/ticketBackground.jpg';
  form: FormGroup;
  dealId: string;
  industryId: string;
  couponId: string;
  routSub: Subscription = null;
  selectQuantity: lookupdata[] = [];
  selectLocation: lookupdata[] = [];
  data:any[]=[];
  locations:any[]=[];
  industry={};
  moment=moment;
  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.industryId=qparams['industryId'];
      this.couponId=qparams['couponId'];
    });
    
    this.form = this.formBuilder.group({
      quantity: ['', [Validators.required]],
      merchantId: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getTicketDetails(this.industryId,this.couponId);
    this.getLocationsLookup(this.industryId,this.couponId);
  }
  getLocationsLookup(industryId,couponId) {
    const sub = this.ticketService.getLocationsLookup(industryId,couponId).subscribe({
      next: (res) => {
        this.selectLocation = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getTicketDetails(industryId,couponId) {
    const sub = this.ticketService.getTicketDetails({industryId:industryId,couponId:couponId}).subscribe({
      next: (res) => {
        this.data = res['data'].tickets;
        this.industry=res['data'].industry;
        this.locations=res['data'].locations;
        let count=this.data.filter((x)=>x.redeemOnline==true).length;
        this.quantityLookup(this.data.length-count);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  quantityLookup(count) {
    let i: any;
    this.selectQuantity = [];
    for (i = 1; i <= count; i++) {
      this.selectQuantity.push({ name: i, value: i });
    }
  }
  submit() {
    if(this.form.valid){
      const data=Object.assign({},this.form.value);
      data.couponCode=this.couponId;
      data.industryId=this.industryId;
      const sub = this.ticketService.redeemTicket(data).subscribe({
        next: (res) => {
          this.getTicketDetails(this.industryId,this.couponId);
          this.form.reset();
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    else{
      this.form.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}
