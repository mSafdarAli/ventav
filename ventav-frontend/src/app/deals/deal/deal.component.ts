import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { DealService } from 'src/_services/rest/deal.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { MerchantService } from 'src/_services/rest/merchant.service';
import { PaginationService } from 'src/_services/rest/pagination.service';
import { CheckoutIframeComponent } from './checkout-iframe/checkout-iframe.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})
export class DealComponent implements OnInit {
  displayedColumns: string[] = ['dealNumber','dealName','dealSiteLink','firm','offerStartDate','offerEndDate','couponExpiryDate','couponSold','couponGenerated','redeemedOnline','outstanding','active','action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams:Params={};
  searchForm:FormGroup;
  selectPromoter: lookupdata[] = [];
  selectIndustry: lookupdata[] = [];
  selectFirm: lookupdata[] = [];
  baseUrl=environment.baseUrl;
  constructor(
    private dealService: DealService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination:PaginationService,
    private route:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router:Router,
    private lookupService:LookUpService,
    private dialog: MatDialog,
  ) { 
    this.searchForm=this.formBuilder.group({
      q:[''],
      promoterIds:[''],
      industryIds:[''],
      firmId:['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({},qparams);
      if(this.queryParams){
        this.getAllDeal(this.queryParams)
      }
      else{
        this.getAllDeal();
      }
    });
  }

  ngOnInit(): void {
    this.getAllIndustryLookup();
    this.getAllPromoterLookup();
    this.getAllFirmsLookup();
  }
  filter(event) {
    let obj;
    for (const [key, value] of Object.entries(this.searchForm.value)) {
      if (value != '') {
        obj=Object.assign({},obj);
        obj[key] = value;
      }
    }
    this.router.navigate([], {
      queryParams: obj
    });
  }
  clearFilters(){
    if(this.queryParams){
      this.searchForm.reset();
      this.router.navigate([], {
        queryParams: {}
      });
    }
  }
  isObjectEmpty(objectName) {
    return Object.keys(objectName).length;
  }
  changeDealStatus(id,active){
    const sub = this.dealService.changeDealStatus(id,{active:active}).subscribe({
      next: (res) => {
     
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllIndustryLookup(){
    const sub = this.lookupService.getAllIndustries().subscribe({
      next: (res) => {
        this.selectIndustry=res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllFirmsLookup(){
    const sub = this.lookupService.getAllFirms().subscribe({
      next: (res) => {
        this.selectFirm=res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllPromoterLookup(){
    const sub = this.lookupService.getAllPromoters().subscribe({
      next: (res) => {
        this.selectPromoter=res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllDeal(params=null) {
    const sub = this.dealService.getAllDeal(params).subscribe({
      next: (res) => {
        this.dataSource = res['data'];
        this.pager = this.pagination.compile(
          Object.assign({}, this.queryParams, { count: res['pagination'].total })
        );
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  copyIframe(id) {
    const DialogRef = this.dialog.open(CheckoutIframeComponent, {
      data: { id:id,path: 'checkout'},
      minWidth: '50%',
      minHeight: '60%',
      disableClose: true,
    });
  }
  deleteDeal(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.dealService.deleteDeal(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllDeal(this.queryParams);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}
