import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AdminTemplateService } from 'src/_services/rest/adminTemplate.service';

@Component({
  selector: 'app-add-admin-template',
  templateUrl: './add-admin-template.component.html',
  styleUrls: ['./add-admin-template.component.scss']
})
export class AddAdminTemplateComponent implements OnInit {
  adminTemplateId: string = '';
  form: FormGroup;
  fields: any[] = [];
  index: any=-1;
  url: string;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  constructor(
    private formBuilder: FormBuilder,
    private adminTemplateService: AdminTemplateService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      templateName: ['', [Validators.required]],
      used_for: ['', [Validators.required]],
      message: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });

    this.routSub = this.route.params.subscribe((params) => {
      this.adminTemplateId = params['id'];
    });
    this.url=this.router.url;
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
      this.index = qparams['index']?qparams['index']:-1;
    });

    if (this.adminTemplateId != null) {
      const sub = this.adminTemplateService.getSingleAdminTemplate(this.adminTemplateId).subscribe({
        next: (res) => {
          this.form.patchValue({
            templateName: res['data'].templateName ? res['data'].templateName : '',
            used_for: res['data'].used_for ? res['data'].used_for : '',
            message: res['data'].message ? res['data'].message : '',
            code: res['data'].code ? res['data'].code : ''
          });
          this.fields = res['data'].fields;
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  ngOnInit(): void {
  }

  addfields(message, code) {
    if (this.index!=-1) {
      let index=Number(this.index);
      let i = this.fields[index];
      i.code= '{%' + code + '%}'
      i.message=message;
      let newUrl=this.url.split('?')[0];
      this.index=-1;
      window.history.pushState('object', document.title, newUrl);
    }
    else {
      this.fields.push({
        message: message,
        code: '{%' + code + '%}'
      });
    }

    this.form.controls['code'].reset();
    this.form.controls['message'].reset();
  }
  editFields(code, message, i) {
    this.form.patchValue({
      code: code.split('%')[1],
      message: message
    });
    this.router.navigate([], { queryParams: { index: i } });
  }

  submit() {
    const data = Object.assign({}, this.form.value);
    data.fields = this.fields;
    if (this.adminTemplateId != null) {
      const sub = this.adminTemplateService.updateAdminTemplate(this.adminTemplateId, data).subscribe({
        next: (res) => {
          this.toaster.success('Admin Template Updated Successfully', 'Updated');
          this.router.navigate(['/masterdata/admin-templates'], { queryParams: this.queryParams });
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    else {
      const sub = this.adminTemplateService.createAdminTemplate(data).subscribe({
        next: (res) => {
          this.toaster.success('Admin Template Created Successfully', 'Created');
          this.router.navigate(['/masterdata/admin-templates'], { queryParams: this.queryParams });
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }

  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}
