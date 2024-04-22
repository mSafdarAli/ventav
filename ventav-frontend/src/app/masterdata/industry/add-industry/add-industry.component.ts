import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toHTML } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { Subscription, map } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { IndustryService } from 'src/_services/rest/industry.service';
import { LookUpService } from 'src/_services/rest/lookup.service';

@Component({
  selector: 'app-add-industry',
  templateUrl: './add-industry.component.html',
  styleUrls: ['./add-industry.component.scss']
})
export class AddIndustryComponent implements OnInit, OnDestroy {
  form: FormGroup;
  index: any = -1;
  url: string;
  picturesFirst: any;
  payloadTicket: any[] = [];
  questions: any[] = [];
  payloadOther: any[] = [];
  payloadTicketType: any[] = [];
  pictures: any[] = [];
  extraPictures: any[] = [];
  ticketImage: any[] = [];
  industryId: string = '';
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  selectImportType: lookupdata[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private industryService: IndustryService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookUpService,
    private http: HttpClient
  ) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      redumptionSuccessMessage: ['', [Validators.required]],
      redumptionAlreadyMessage: ['', [Validators.required]],
      active: [true],
      ticketText: ['', [Validators.required]],
      imageText: ['', [Validators.required]],
      question: [null],
      options: [null],
      buttonColorCode: [''],
      textColorCode: ['']
    });
    this.url = this.router.url;
    this.selectImportType = this.lookupService.getImportType();
    this.routSub = this.route.params.subscribe((params) => {
      this.industryId = params['id'];

    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
      if (qparams['index']) {
        this.index = qparams['index'];
      }
    });
    if (this.industryId != null) {
      const sub = this.industryService.getSingleIndustry(this.industryId).subscribe({
        next: (res) => {
          if (res['data']?.ticketImage) {
            this.picturesFirst = res['data']?.ticketImage[0];
          }
          if (res['data']?.dealPageImages) {
            this.pictures = res['data']?.dealPageImages;
            res['data']?.dealPageImages.forEach(x => {
              fetch(x)
                .then(async response => {
                  const ext = response.url.split('.')[1];
                  const contentType = response.headers.get('content-type');
                  const blob = await response.blob();
                  const file = new File([blob], 'file.' + ext, { type: contentType })
                  this.payloadOther.push(file);
                })
            })
          }
          if (res['data'].questions.length > 0) {
            this.questions = res['data'].questions;
          }
          this.form.patchValue({
            name: res['data'].name ? res['data'].name : '',
            redumptionSuccessMessage: res['data'].redumptionSuccessMessage ? res['data'].redumptionSuccessMessage : '',
            redumptionAlreadyMessage: res['data'].redumptionAlreadyMessage ? res['data'].redumptionAlreadyMessage : '',
            active: res['data'].active ? res['data'].active : false,
            ticketText: res['data'].ticketText ? res['data'].ticketText : '',
            imageText: res['data'].imageText ? res['data'].imageText : '',
            buttonColorCode: res['data'].buttonColorCode ? res['data'].buttonColorCode : '',
            textColorCode: res['data'].textColorCode ? res['data'].textColorCode : ''
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
  // uploadTicketType(event) {
  //   const file = event.target.files[0];
  //   for (let i = 0; i < event.target.files.length; i++) {
  //     this.payloadTicketType.push(event.target.files[i])
  //   }
  // }
  uploadDealImage(event) {
    const file = event.target.files[0];
    for (let i = 0; i < event.target.files.length; i++) {
      if (this.payloadOther.length < 3) {
        this.payloadOther.push(event.target.files[i]);
      }
    }
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (this.pictures.length < 3) {
          this.pictures.push(event.target.result);
        }
      };
      reader.readAsDataURL(event.target.files[index]);
    }

  }
  uploadTicketImage(event) {
    this.payloadTicket = [];
    const file = event.target.files[0];
    if (this.payloadTicket.length < 1) {
      this.payloadTicket.push(file);
    }

    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.picturesFirst = event.target.result;
      };
      reader.readAsDataURL(event.target.files[index]);
    }
  }
  removeFile(file, image = false) {
    if (image) {
      this.picturesFirst = '';
      const index = this.payloadTicket.indexOf(file);
      this.payloadTicket.splice(index, 1);
    }
    const ind = this.pictures.indexOf(file);
    this.pictures.splice(ind, 1);
    this.payloadOther.splice(ind, 1);
  }
  getExtraElement() {
    this.extraPictures = []
    if (this.pictures.length < 3) {
      const length = (3 - this.pictures.length)

      for (let index = 0; index < length; index++) {
        this.extraPictures.push(index)
      }
    }
    return this.extraPictures;
  }
  addNewQuestion(question, options) {
    if (this.index != -1) {
      let index = Number(this.index);
      let i = this.questions[index];
      i.question = question;
      i.options = options
      let newUrl = this.url.split('?')[0];
      this.index = -1;
      window.history.pushState('object', document.title, newUrl);
    }
    else {
      this.questions.push({
        question: question,
        options: options
      });
    }
    this.form.controls['question'].reset();
    this.form.controls['options'].reset();
  }
  editQuestion(question, options, i) {
    this.form.patchValue({
      question: question,
      options: options
    });
    this.router.navigate([], { queryParams: { index: i } });
  }
  deleteQuestion(i) {
    this.questions.splice(i, 1);
  }
  submit() {
    if (this.form.valid) {
      const html = (typeof this.form.value.imageText == "object") ? toHTML(this.form.value.imageText) : this.form.value.imageText;
      const ticketText = (typeof this.form.value.ticketText == "object") ? toHTML(this.form.value.ticketText) : this.form.value.ticketText;
      const data = Object.assign({}, this.form.value);
      data.imageText = html;
      data.ticketText = ticketText;
      data.questions = this.questions;
      if (this.industryId != null) {
        const sub = this.industryService.updateIndustry(this.industryId, this.payloadTicket, this.payloadOther, data).subscribe({
          next: (res) => {
            this.toaster.success('Industry Updated Successfully', 'Updated');
            this.router.navigate(['/masterdata/industries'], { queryParams: this.queryParams });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.industryService.createIndustry(this.payloadTicket, this.payloadOther, data).subscribe({
          next: (res) => {
            this.toaster.success('Industry Created Successfully', 'Created');
            this.router.navigate(['/masterdata/industries'], { queryParams: this.queryParams });
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
