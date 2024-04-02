import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { FirmService } from 'src/_services/rest/firm.service';
import { PaginationService } from 'src/_services/rest/pagination.service';
import { ViewFirmComponent } from './view/view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-firm',
  templateUrl: './firm.component.html',
  styleUrls: ['./firm.component.scss']
})
export class FirmComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['companyName','contactName','contactPhone','contactEmail','rating','active', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams:Params={};
  searchForm:FormGroup;
  constructor(
    private firmService: FirmService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination:PaginationService,
    private route:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router:Router,
    public dialog: MatDialog
  ) {
    this.searchForm=this.formBuilder.group({
      q:['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({},qparams);
      if(this.queryParams){
        this.getAllFirm(this.queryParams)
      }
      else{
        this.getAllFirm();
      }
    });

  }
  viewDetail(id){
    const DialogRef = this.dialog.open(ViewFirmComponent, {
      data: { id: id },
      minWidth: '30%',
      height: '50%',
      disableClose: true,
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
  getAllFirm(params=null) {
    const sub = this.firmService.getAllFirm(params).subscribe({
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
  deletefirm(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.firmService.deleteFirm(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllFirm(this.queryParams);
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