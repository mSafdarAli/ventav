import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { EmailTemplateService } from 'src/_services/rest/emailTemplate.service';
import { PaginationService } from 'src/_services/rest/pagination.service';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit, OnDestroy {

  usedForColumns: string[] = ['emailCategories'];
  dataSource: any[] = [];
  pager: Pagination;
  queryParams: Params = {};
  searchForm: FormGroup;
  filteredData: any[] = [];
  copyData: any;
  categoryId: string;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  constructor(
    private emailService: EmailTemplateService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private pagination: PaginationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.formBuilder.group({
      q: ['']
    })
    this.getCategories();
    this.routSub = this.route.params.subscribe((params) => {
      this.categoryId = params['categoryID'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
  }

  ngOnInit(): void {

  }
  search(params) {
    this.router.navigate([], {
      queryParams: params
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

  getCategories(params = null) {
    const sub = this.emailService.getAllTemplates(params).subscribe({
      next: (res) => {
        this.dataSource = res['data'];
        // this.getDataById(this.dataSource[0]._id);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }




  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}