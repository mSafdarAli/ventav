import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { AnimationService, slider } from 'src/_services/animation.service';
import { MessageService } from 'src/_services/message.service';
import { IndustryService } from 'src/_services/rest/industry.service';
import { PaginationService } from 'src/_services/rest/pagination.service';
import { RedeemIframeComponent } from './redeem-iframe/redeem-iframe.component';
const ELEMENT_DATA= [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss'],
  animations: [
		slider
	]
})

export class IndustryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'active', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams:Params={};
  searchForm:FormGroup;
  animState = 'full';
  slideview = 'full';
  active: '';
  constructor(
    private industryService: IndustryService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination:PaginationService,
    private route:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router:Router,
    public animationService:AnimationService,
    public dialog: MatDialog
  ) { 
    this.searchForm=this.formBuilder.group({
      q:['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({},qparams);
      if(this.queryParams){
        this.getAllIndustry(this.queryParams)
      }
      else{
        this.getAllIndustry();
      }
    });
  }
  openDialog(): void {
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
  getAllIndustry(params=null) {
    const sub = this.industryService.getAllIndustry(params).subscribe({
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
  deleteIndustry(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.industryService.deleteIndustry(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllIndustry(this.queryParams);
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  copyIframe(id) {
    const DialogRef = this.dialog.open(RedeemIframeComponent, {
      data: { id:id,path: 'redeem-coupon'},
      minWidth: '50%',
      minHeight: '60%',
      disableClose: true,
    });
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}
