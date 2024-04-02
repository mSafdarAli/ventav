import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdvanceSearchComponent } from '../advance-search/advance-search.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/_services/message.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/_services/rest/pagination.service';
import { Pagination } from 'src/_models/pagination';
import { DashboardService } from 'src/_services/rest/dashboard.service';
import { PermissionService } from 'src/_services/permission.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy {
  routeSub: Subscription;
  queryParams: Params;
  data:any[]=[];
  paginationHide: boolean;
  pager: Pagination;
  totalRecords:any;
  constructor(
    private dialog: MatDialog,
    private route:ActivatedRoute,
    private pagination: PaginationService,
    private messageService: MessageService,
    private ps:PermissionService,
    private toaster: ToastrService,
    private dashboardService:DashboardService
  ) { 
    this.routeSub = this.route.queryParams.subscribe((queryParams) => {
      this.queryParams = queryParams;
      if (Object.keys(this.queryParams).length > 0) {
        this.getDashboardData(queryParams);
      }
      else{
        // this.getDashboardData();
      }
    });
  }

  ngOnInit(): void {
  }
  getDashboardData(queryParams=null){
    const sub = this.dashboardService.getDashboardData(queryParams).subscribe({
      next: (res) => {
        if(res['data'].length>0){
          this.data = res['data'];
          this.totalRecords=res['pagination'].total;
          this.paginationHide = this.data.length < 1 ? true : false;
          this.pager = this.pagination.compile(
            Object.assign({}, this.queryParams, { count: res['pagination'].total })
          );
        }else{
          this.data=[];
          this.totalRecords=0;
        }
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  advanceSearch() {
    const DialogRef = this.dialog.open(AdvanceSearchComponent, {
      // data: { customerId: this.form.controls['customerId'].value },
      width: '60%',
      height: '40%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe(result => {
      this.getDashboardData(this.queryParams);
      sub.unsubscribe();
    });
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
