import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toHTML } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/_services/auth.service';
import { EmailTemplateService } from 'src/_services/rest/emailTemplate.service';
import { UserService } from 'src/_services/rest/user.service';

@Component({
  selector: 'app-add-tempalte',
  templateUrl: './add-tempalte.component.html',
  styleUrls: ['./add-tempalte.component.scss']
})
export class AddTempalteComponent implements OnInit, OnDestroy {
  templateId: string = '';
  categoryId: string = '';
  role: string = '';
  promoterId: string = '';
  used_for: string = '';
  form: FormGroup;
  fields: any[]=[];
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  constructor(
    private formBuilder: FormBuilder,
    private templateService: EmailTemplateService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      mailFrom: ['', [Validators.required,Validators.email]],
      active: [true, [Validators.required]]
    });
    this.role = this._authService.userDetails.role.name;
    this.routSub = this.route.params.subscribe((params) => {
      this.templateId = params['id'];
      this.categoryId = params['categoryID']
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    if (this.categoryId) {
      const sub = this.templateService.getTemplatFields(this.categoryId).subscribe({
        next: (res) => {
          this.fields = res['data']['fields'];
          this.used_for = res['data'].used_for;
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    if (this.templateId != null) {
      const sub = this.templateService.getSingleTemplate(this.templateId).subscribe({
        next: (res) => {
          this.form.patchValue({
            name: res['data'].name ? res['data'].name : '',
            subject: res['data'].subject ? res['data'].subject : '',
            active: res['data'].active ? res['data'].active : false,
            message: res['data'].message ? res['data'].message : '',
            mailFrom: res['data'].mailFrom ? res['data'].mailFrom : ''
          });
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
  copyClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.toaster.success('Copy to Clipboard', 'Success');
  }
  
  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.templateId = this.categoryId;
      const html = (typeof this.form.value.message == "object") ? toHTML(this.form.value.message) : this.form.value.message;
      data.message = html;
      if (['promoter'].indexOf(this.role) > -1) {
        data.promoterId = this._authService.userDetails._id;
      }
      if (this.templateId != null) {
        const sub = this.templateService.updateTemplate(this.templateId, data).subscribe({
          next: (res) => {
            this.toaster.success('Template Updated Successfully', 'Updated');
            this.router.navigate(['/masterdata/email-templates/' + this.categoryId]);
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.templateService.createTemplate(data).subscribe({
          next: (res) => {
            this.toaster.success('Template Created Successfully', 'Created');
            this.router.navigate(['/masterdata/email-templates/' + this.categoryId]);
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }

    }
    else {
      this.form.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}
