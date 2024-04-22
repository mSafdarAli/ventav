import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { CustomerService } from 'src/_services/rest/customer.service';
import { PaginationService } from 'src/_services/rest/pagination.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email','birthday','zipCode','createdAt'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams:Params={};
  searchForm:FormGroup;
  moment=moment;
  constructor(
    private coustomerService: CustomerService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination:PaginationService,
    private route:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router:Router
  ) {
    this.searchForm=this.formBuilder.group({
      q:['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({},qparams);
      if(this.queryParams){
        this.getAllCustomers(this.queryParams)
      }
      else{
        this.getAllCustomers();
      }
    });

  }
  ngOnInit(): void {
  }
  search(params) {
    this.router.navigate([], {
      queryParams: params
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
  getAllCustomers(params=null) {
    const sub = this.coustomerService.getAllCustomers(params).subscribe({
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
}
