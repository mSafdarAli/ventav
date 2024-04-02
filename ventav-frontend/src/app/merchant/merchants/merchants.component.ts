import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { Pagination } from 'src/_models/pagination';
import { AnimationService } from 'src/_services/animation.service';
import { MessageService } from 'src/_services/message.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { MerchantService } from 'src/_services/rest/merchant.service';
import { PaginationService } from 'src/_services/rest/pagination.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss']
})
export class MerchantsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'contactName', 'phone', 'street', 'city', 'zipCode', 'status', 'promotor', 'state', 'website', 'industry', 'notes', 'active', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams: Params = {};
  searchForm: FormGroup;
  selectPromoter: lookupdata[] = [];
  selectIndustry: lookupdata[] = [];
  selectStatus: lookupdata[] = [];
  constructor(
    private lookupService: LookUpService,
    private merchantService: MerchantService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination: PaginationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    public animationService: AnimationService
  ) {
    this.searchForm = this.formBuilder.group({
      q: [''],
      promoterId:[''],
      industryId:[''],
      status:['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({}, qparams);
      if (this.queryParams) {
        this.getAllMerchant(this.queryParams)
      }
      else {
        this.getAllMerchant();
      }
    });
  }

  ngOnInit(): void {
    this.getAllIndustryLookup();
    this.getAllPromoterLookup();
    this.selectStatus=this.lookupService.getMerchantStatus();
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
  
  clearFilters() {
    if (this.queryParams) {
      this.searchForm.reset();
      this.router.navigate([], {
        queryParams: {}
      });
    }
  }
  isObjectEmpty(objectName) {
    return Object.keys(objectName).length;
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
  getAllMerchant(params = null) {
    const sub = this.merchantService.getAllMerchant(params).subscribe({
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
  deleteMerchant(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.merchantService.deleteMerchant(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllMerchant(this.queryParams);
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
