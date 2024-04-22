import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { TicketService } from 'src/_services/rest/ticket.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit,OnDestroy {
  imageUrl: string = 'assets/images/ticketBackground.jpg';
  form: FormGroup;
  dealId: string;
  used:boolean=true
  industryId: string;
  routSub: Subscription = null;
  selectQuantity: lookupdata[] = [];
  selectLocation: lookupdata[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.industryId = params['industryId'];
      this.dealId = params['dealId'];
    });
    this.form = this.formBuilder.group({
      ticketQuantity: ['', [Validators.required]],
      location: ['', [Validators.required]]
    })
  }
  
  ngOnInit(): void {
    this.quantityLookup(5)
    this.getLocationsLookup(this.industryId);
  }
  getLocationsLookup(industryId) {
    // const sub = this.ticketService.getLocationsLookup({industryId:industryId}).subscribe({
    //   next: (res) => {
    //     this.selectLocation = res['data'];
    //     sub.unsubscribe();
    //   },
    //   error: (res) => {
    //     sub.unsubscribe();
    //   },
    // });
  }
  quantityLookup(count) {
    let i: any;
    this.selectQuantity = [];
    for (i = 1; i <= count; i++) {
      this.selectQuantity.push({ name: i, value: i });
    }
  }
  submit() {
    // if(this.form.valid){
    //   const sub = this.lookupService.getLocationsLookup(industryId, dealId).subscribe({
    //     next: (res) => {
    //       this.quantityLookup(5 - this.form.value.ticketQuantity)
    //       sub.unsubscribe();
    //     },
    //     error: (res) => {
    //       sub.unsubscribe();
    //     },
    //   });
    // }
    // else{
    //   this.form.markAllAsTouched();
    // }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}
