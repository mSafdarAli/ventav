import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { AnimationService } from 'src/_services/animation.service';
import { MessageService } from 'src/_services/message.service';
import { AdminTemplateService } from 'src/_services/rest/adminTemplate.service';
import { IndustryService } from 'src/_services/rest/industry.service';
import { PaginationService } from 'src/_services/rest/pagination.service';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.scss']
})
export class AdminTemplateComponent implements OnInit ,OnDestroy{
  displayedColumns: string[] = ['templateName','used_for', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams:Params={};
  searchForm:FormGroup;
  animState = 'full';
  slideview = 'full';
  active: '';
  constructor(
    private admintemplateService: AdminTemplateService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination:PaginationService,
    private route:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router:Router,
    public animationService:AnimationService
  ) { 
    this.searchForm=this.formBuilder.group({
      q:['']
    })
    this.routSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({},qparams);
      if(this.queryParams){
        this.getAllAdminTemplate(this.queryParams)
      }
      else{
        this.getAllAdminTemplate();
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
  getAllAdminTemplate(params=null) {
    const sub = this.admintemplateService.getAllAdminTemplate(params).subscribe({
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
  // deleteAdminTemplate(id) {
  //   const isub = this.messageService
  //     .prompt(`Are you sure you want to delete this record?`)
  //     .afterClosed()
  //     .pipe(
  //       filter((_confirmed: boolean) => _confirmed),
  //       switchMap(() => {
  //         return this.admintemplateService.deleteAdminTemplate(id);
  //       })
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         this.getAllAdminTemplate(this.queryParams);
  //         this.toaster.success('Deleted Successfully', 'Deleted');
  //         isub.unsubscribe();
  //       },
  //       error: (res) => {
  //         isub.unsubscribe();
  //       },
  //     });
  // }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}