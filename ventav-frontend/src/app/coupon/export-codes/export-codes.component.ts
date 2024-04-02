import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/_services/export.service';
import { CouponService } from 'src/_services/rest/coupon.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-export-codes',
  templateUrl: './export-codes.component.html',
  styleUrls: ['./export-codes.component.scss']
})
export class ExportCodesComponent implements OnInit {
  dealId: string;
  form: FormGroup;
  couponData:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<ExportCodesComponent>,
    private formBuilder: FormBuilder,
    private couponService: CouponService,
    private toaster: ToastrService,
    private exportservice:ExportService
  ) {
   
    this.form = this.formBuilder.group({
      date: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.dealId =this.data.id;
      data.date = changeDateToApiFormat(data.date);
      const sub = this.couponService.getCouponCodes(data).subscribe({
        next: (res) => {
          this.couponData=res['data'];
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }
  exportCoupons(){
    this.exportservice.exportCoupons(this.couponData);
    this.dialogRef.close();
  }

}
