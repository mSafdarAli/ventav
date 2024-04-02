import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { FirmService } from 'src/_services/rest/firm.service';
import { LookUpService } from 'src/_services/rest/lookup.service';

@Component({
  selector: 'app-add-firm',
  templateUrl: './add-firm.component.html',
  styleUrls: ['./add-firm.component.scss']
})
export class AddFirmComponent implements OnInit {
  firmId: string = '';
  form: FormGroup;
  selectRating: lookupdata[] = [];
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  constructor(
    private firmService: FirmService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookUpService
  ) {
    this.form = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      contactPhone: ['', [Validators.required]],
      contactEmail: ['', [Validators.required,Validators.email]],
      rating: ['', [Validators.required]],
      active: [true],
    });
    this.selectRating = this.lookupService.getRating();
    this.routSub = this.route.params.subscribe((params) => {
      this.firmId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    if (this.firmId != null) {
      const sub = this.firmService.getSingleFirm(this.firmId).subscribe({
        next: (res) => {
          this.form.patchValue({
            companyName: res['data'].companyName ? res['data'].companyName : '',
            contactName: res['data'].contactName ? res['data'].contactName : '',
            contactPhone: res['data'].contactPhone ? res['data'].contactPhone : '',
            contactEmail: res['data'].contactEmail ? res['data'].contactEmail : '',
            rating: res['data'].rating ? res['data'].rating : '',
            active: res['data'].active ? res['data'].active : false,

          })
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
  submit() {
    if (this.form.valid) {
      if (this.firmId != null) {
        const sub = this.firmService.updateFirm(this.firmId, this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Deal Firm Updated Successfully', 'Updated');
            this.router.navigate(['/masterdata/firms'], { queryParams: this.queryParams });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.firmService.createFirm(this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Deal Firm Created Successfully', 'Created');
            this.router.navigate(['/masterdata/firms'], { queryParams: this.queryParams });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }

    }
    else{
      this.form.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}
