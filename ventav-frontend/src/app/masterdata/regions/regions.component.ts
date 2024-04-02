import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { PaginationService } from 'src/_services/rest/pagination.service';
import { RegionService } from 'src/_services/rest/region.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['name', 'state', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams:Params={};
  searchForm:FormGroup;
  constructor(
    private regionService: RegionService,
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
        this.getAllRegions(this.queryParams)
      }
      else{
        this.getAllRegions();
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
  getAllRegions(params=null) {
    const sub = this.regionService.getAllRegions(params).subscribe({
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
  deleteRegion(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.regionService.deleteRegion(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllRegions(this.queryParams);
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
