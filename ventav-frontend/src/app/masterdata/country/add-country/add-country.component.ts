import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CountryService } from 'src/_services/rest/country.service';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss']
})
export class AddCountryComponent implements OnInit,OnDestroy {
  countryId: string = '';
  form: FormGroup;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      iso3: ['', [Validators.required]],
      phone_code: ['', [Validators.required]],
      capital: ['', [Validators.required]],
      currency: ['', [Validators.required]]
    });
    this.routSub = this.route.params.subscribe((params) => {
      this.countryId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    if (this.countryId != null) {
      const sub = this.countryService.getSingleCountry(this.countryId).subscribe({
        next: (res) => {
          this.form.patchValue({
            name: res['data'].name ? res['data'].name : '',
            iso3: res['data'].iso3 ? res['data'].iso3 : '',
            phone_code: res['data'].phone_code ? res['data'].phone_code : '',
            capital: res['data'].capital ? res['data'].capital : '',
            currency: res['data'].currency ? res['data'].currency : ''
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
  submit(){
    if(this.form.valid){
      if(this.countryId!=null){
        const sub = this.countryService.updateCountry(this.countryId,this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Country Updated Successfully', 'Updated');
            this.router.navigate(['/masterdata/countries'],{queryParams:this.queryParams});
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else{
        const sub = this.countryService.createCountry(this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Country Created Successfully', 'Created');
            this.router.navigate(['/masterdata/countries'],{queryParams:this.queryParams});
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
