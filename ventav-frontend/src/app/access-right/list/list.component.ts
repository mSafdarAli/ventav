import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { PaginationService } from 'src/_services/rest/pagination.service';
import { UserService } from 'src/_services/rest/user.service';
import { ViewComponent } from '../view/view.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit ,OnDestroy{
  displayedColumns: string[] = ['name', 'email', 'role','active', 'action'];
  dataSource: any[] = [];
  pager: Pagination;
  routSub: Subscription = null;
  queryParams:Params={};
  searchForm:FormGroup;
  constructor(
    private userService: UserService,
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
        this.getAllUsers(this.queryParams)
      }
      else{
        this.getAllUsers();
      }
    });

  }

  ngOnInit(): void {
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
  getAllUsers(params=null) {
    const sub = this.userService.getAllUsers(params).subscribe({
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
  viewDetail(id){
    // console.log(id)
    const DialogRef = this.dialog.open(ViewComponent, {
      data: { id: id },
      minWidth: '30%',
      minHeight: '40%',
      disableClose: true,
    });
  }
  deleteUser(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.userService.deleteUser(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllUsers(this.queryParams);
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
