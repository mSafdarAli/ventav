import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { PaginationService } from 'src/_services/rest/pagination.service';
import { TicketService } from 'src/_services/rest/ticket.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['ticketNumber', 'couponNumber', 'name', 'redeemOnline', 'locationRedeemed', 'merchant', 'deal', 'dailyDealFirm', 'industry', 'createdAt', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams: Params = {};
  searchForm: FormGroup;
  selectIndustry: lookupdata[] = [];
  selectRedeemOnline: lookupdata[] = [];
  selectDeal: lookupdata[] = [];
  moment = moment;
  constructor(
    private ticektService: TicketService,
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
      redeemOnline: [''],
      industryId: [''],
      dealId: [''],
      createdAt__gte: [''],
      createdAt__lte: ['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({}, qparams);
      if (this.queryParams) {
        this.getAllTickets(this.queryParams)
      }
      else {
        this.getAllTickets();
      }
    });

  }

  ngOnInit(): void {
    this.selectRedeemOnline = this.lookupService.getRedeemStatus();
    this.getAllIndustryLookup();
  }
  filter(event) {
    let obj;
    for (const [key, value] of Object.entries(this.searchForm.value)) {
      if (value != '') {
        obj = Object.assign({}, obj);
        if (typeof value == 'object' && value!=null) {
          if (key == 'createdAt__gte' || key == 'createdAt__lte') {
            obj[key] = changeDateToApiFormat(value);
          }
          else {
            obj[key] = value['value'];
          }
        }
        else {
          obj[key] = value;
        }
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
  getAllIndustryLookup() {
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
  getDeals() {
    this.selectDeal = [];
    if (this.searchForm.value.dealId.length > 2) {
      const sub = this.lookupService.getAllDealLookup({ dealName: this.searchForm.value.dealId }).subscribe({
        next: (res) => {
          this.selectDeal = res['data'];
          sub.unsubscribe();
        },
        error: (res) => {
        },
      });
    }
  }
  displayFn(option) {
    return option?.name;
  }
  getAllTickets(params = null) {
    const sub = this.ticektService.getAllTickets(params).subscribe({
      next: (res) => {
        this.dataSource = res['data'];
        this.selectDeal = [];
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
  deleteTicket(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.ticektService.deleteTicket(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllTickets(this.queryParams);
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