import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { CouponService } from 'src/_services/rest/coupon.service';
import { IndustryService } from 'src/_services/rest/industry.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { RedeemService } from 'src/_services/rest/redeem.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-redeem-coupon',
  templateUrl: './redeem-coupon.component.html',
  styleUrls: ['./redeem-coupon.component.scss']
})
export class RedeemCouponComponent implements OnInit, OnDestroy {
  form: FormGroup;
  routSub: Subscription = null;
  industryId: string;
  redumptionAlready: string;
  redumptionSuccessMessage: string;
  questions: any[] = [];
  data: any[] = [];
  answers: any[] = [];
  regionsByStateId: any[] = [];
  showMessage: boolean = false;
  success: boolean = false;
  selectState: lookupdata[] = [];
  selectRegion: lookupdata[] = [];
  selectRegionReference: lookupdata[] = [];
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private redeemService: RedeemService,
    private toaster: ToastrService,
    private lookupService: LookUpService
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.industryId = params['id'];
    });
    this.form = this.formBuilder.group({
      redemptionCode: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      dob: [''],
      name: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      answer: [''],
      stateIds: ['',[Validators.required]],
      regionIds: ['',[Validators.required]],

    });
    if (this.industryId != null) {
      const sub = this.redeemService.getIndustry(this.industryId).subscribe({
        next: (res) => {
          this.data=res['data'];
          this.questions = res['data']?.questions ? res['data']?.questions : [];
          this.redumptionAlready = res['data'].redumptionAlreadyMessage;
          this.redumptionSuccessMessage = res['data'].redumptionSuccessMessage;
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
  getStatesAndRegions(code) {
    const sub = this.redeemService.getStatesAndRegions(code).subscribe({
      next: (res) => {
        this.selectState = res['data'].states;
        this.selectRegion = res['data'].regions;
        this.selectRegionReference = res['data'].regions;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getRegionsByStateId(stateIds) {
    this.regionsByStateId = [];
    stateIds.forEach((stateId) => {
      this.selectRegionReference.forEach((x) => {
        if (x.stateId == stateId) {
          this.regionsByStateId.push(x);
        }
      })
    });
    this.selectRegion = this.regionsByStateId;
  }
  customStyle(background, text) {
    return {
      background: background ? background : '#0D6EFD',
      color: text ? text : '#fff'
    }
  }
  splitToArray(value) {
    return value.split(',');
  }
  selectionChange(question, event) {
    let answer = event.value;
    if (this.answers.some(q => q.question == question)) {
      let x = this.answers.findIndex(q => q.question == question);
      this.answers[x].question = question;
      this.answers[x].answer = answer;
    }

    else {
      this.answers.push({
        question: question,
        answer: answer
      });
    }
  }
  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.dob = changeDateToApiFormat(data.dob);
      data.survey = this.answers;
      delete data.answer;
      const sub = this.redeemService.redeemCoupon(data).subscribe({
        next: (res) => {
          if (res['data'].success == true && res['data'].message == 'Coupon Redeemed Successfully') {
            this.showMessage = true;
            this.success = true;
          }
          else {
            this.showMessage = true;
          }
          this.form.reset();
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
  hideMessage() {
    this.showMessage = false;
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }

}
