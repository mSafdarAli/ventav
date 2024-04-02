import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { CouponService } from 'src/_services/rest/coupon.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { PaginationService } from 'src/_services/rest/pagination.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['couponNumber', 'name', 'email', 'redeemOnline', 'deal', 'dailyDealFirm', 'createdAt', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams: Params = {};
  searchForm: FormGroup;
  selectDeal: lookupdata[] = [];
  selectStatus: lookupdata[] = [];
  moment = moment
  constructor(
    private couponService: CouponService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination: PaginationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private lookupService: LookUpService
  ) {
    this.searchForm = this.formBuilder.group({
      q: [''],
      dealId: [''],
      redeemOnline: ['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({}, qparams);
      if (this.queryParams) {
        this.getAllCoupons(this.queryParams)
      }
      else {
        this.getAllCoupons();
      }
    });

  }

  ngOnInit(): void {
    this.selectStatus = this.lookupService.getRedeemStatus();
    this.getAllDealLookup();
  }
  filter(event) {
    let obj;
    for (const [key, value] of Object.entries(this.searchForm.value)) {
      if (value != '') {
        obj = Object.assign({}, obj);
        obj[key] = value;
      }
    }
    this.router.navigate([], {
      queryParams: obj
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
  getAllDealLookup() {
    const sub = this.lookupService.getAllDealLookup().subscribe({
      next: (res) => {
        this.selectDeal = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllCoupons(params = null) {
    const sub = this.couponService.getAllCoupons(params).subscribe({
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
  deleteCoupon(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.couponService.deleteCoupon(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllCoupons(this.queryParams);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  updateEmail(id, email) {
    const sub = this.couponService.updateEmail(id, email).subscribe({
      next: (res) => {
        this.toaster.success('Email updated Successfully', 'Update');
        this.getAllCoupons(this.queryParams);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}