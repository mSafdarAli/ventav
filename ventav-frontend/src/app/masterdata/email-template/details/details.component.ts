import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { AuthService } from 'src/_services/auth.service';
import { MessageService } from 'src/_services/message.service';
import { EmailTemplateService } from 'src/_services/rest/emailTemplate.service';
import { PaginationService } from 'src/_services/rest/pagination.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  filteredData: any[] = [];
  displayedColumns: string[] = ['templateName', 'subject', 'active', 'action'];
  queryParams: Params = {};
  templateId: string = '';
  pager: Pagination;
  paramsSub: Subscription = null;
  querySub: Subscription = null;
  copyData: any;
  userId:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emailService: EmailTemplateService,
    private messageService: MessageService,
    private pagination: PaginationService,
    private toaster: ToastrService,
    public _authService:AuthService
  ) {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.templateId = params['categoryID'];
      if (this.templateId) {
        this.getDataById(this.templateId);
      }
    });
    this.querySub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({}, qparams);
      if (this.queryParams) {
        this.getDataById(this.templateId, this.queryParams)
      }
      else {
        this.getDataById(this.templateId);
      }
    });
  }

  ngOnInit(): void {
    this.userId=this._authService.userDetails._id;
    if(['Admin','Super Admin'].indexOf(this._authService.userDetails.role.name)>-1){
      this.displayedColumns.splice(2,0,'createdByName');
    }
  }
  updateStatus(id) {
    const sub = this.emailService.updateStatus(this.templateId, id).subscribe({
      next: (res) => {
        this.toaster.success('Template Activated Successfully', 'Success');
        this.getDataById(this.templateId);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getDataById(id, params = null) {
    const sub = this.emailService.getTemplateDetail(id, params).subscribe({
      next: (res) => {
        if (res['data'] != null) {
          this.filteredData = res['data'];
          this.pager = this.pagination.compile(
            Object.assign({}, this.queryParams, { count: res['pagination'].total })
          );
          
        }
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  duplicateTemplate(id: string) {
    const sub = this.emailService.duplicateTemplate(id).subscribe({
      next: (res) => {
        this.toaster.success(' Duplicated Successfully', 'Success');
        this.getDataById(this.templateId);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  deleteTemplate(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.emailService.deleteTemplate(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.toaster.success('Deleted Successfully', 'Deleted');
          this.getDataById(this.templateId);
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
    this.querySub.unsubscribe();
  }
}
