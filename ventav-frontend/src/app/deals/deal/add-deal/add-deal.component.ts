import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { AuthService } from 'src/_services/auth.service';
import { DealService } from 'src/_services/rest/deal.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { MerchantService } from 'src/_services/rest/merchant.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-add-deal',
  templateUrl: './add-deal.component.html',
  styleUrls: ['./add-deal.component.scss']
})
export class AddDealComponent implements OnInit, OnDestroy {
  dealId: string = '';
  discounts: any[] = [];
  index: any = -1;
  url: string;
  form: FormGroup;
  selectPortionToLocation: lookupdata[] = [];
  selectStates: lookupdata[] = [];
  selectDealCompany: lookupdata[] = [];
  selectDealTemplate: lookupdata[] = [];
  selectFirms: lookupdata[] = [];
  selectPromotor: lookupdata[] = [];
  selectIndustry: lookupdata[] = [];
  selectUnit: lookupdata[] = [];
  selectRegion: lookupdata[] = [];
  selectDealType: lookupdata[] = [];
  selectMerchant: lookupdata[] = [];
  RegionRefrence: lookupdata[] = [];
  merchantReference: lookupdata[] = [];
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  logo: any;
  selectedIndustryId: any[] = [];
  selectedPromoterId: any[] = [];
  regionsByStateId: any[] = [];
  stateByMerchantId: any[] = [];
  merchantByRegiontIds: any[] = [];
  stateReference: any[] = [];
  logoPreview: any;
  roleName: string = '';
  roleId: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private lookupService: LookUpService,
    private dealService: DealService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private _authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      promoterIds: ['', [Validators.required]],
      buttonColorCode: [''],
      bannerColorCode: [''],
      textColorCode: [''],
      dealName: ['', [Validators.required]],
      publicDealName: ['', [Validators.required]],
      firmId: ['', [Validators.required]],
      dealSiteLink: ['', [Validators.required]],
      dealNumber: ['', [Validators.required]],
      offerStartDate: ['', [Validators.required]],
      offerEndDate: ['', [Validators.required]],
      couponExpiryDate: ['', [Validators.required]],
      customerPrice: ['', [Validators.required]],
      dailyFirmPortion: ['', [Validators.required, Validators.max(100), Validators.min(0)]],
      charity: ['', [Validators.required, Validators.max(100), Validators.min(0)]],
      representative: ['', [Validators.required]],
      discount: ['', [Validators.required, Validators.max(100), Validators.min(0)]],
      templateId: [''],
      newDiscountPercentage: [''],
      newDiscount: [''],
      stateIds: ['', [Validators.required]],
      industryIds: ['', [Validators.required]],
      merchantIds: ['', [Validators.required]],
      regionIds: ['', [Validators.required]],
      hideExpiryDate: [false, [Validators.required]],
      dealSpecificEmail: [false, [Validators.required]],
      startNotification: [false, [Validators.required]],
      inHouseDeal: [false, [Validators.required]],
      sortBy: ['alphabetically', [Validators.required]],
      emailCC: ['', [Validators.required,Validators.email]],
      checkoutText: ['', [Validators.required]],
      promoterPortionDetails: this.formBuilder.array([]),
      active: [true],
      industryDetails: this.formBuilder.array([])
    });
    this.roleName = this._authService.userDetails.role.name;
    this.roleId = this._authService.userDetails._id;

    this.url = this.router.url;
    this.routSub = this.route.params.subscribe((params) => {
      this.dealId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
      this.index = qparams['index'] ? qparams['index'] : -1;
    });
    if (this.dealId != null) {
      const sub = this.dealService.getSingleDeal(this.dealId).subscribe({
        next: (res) => {
          this.logoPreview = res['data']?.checkoutLogo[0] ? res['data']?.checkoutLogo[0] : '';
          this.getDataByIndustryId(res['data'].industryIds);
          this.selectedIndustryId = res['data'].industryIds;
          this.selectedPromoterId = res['data'].promoterIds;
          this.discounts = res['data']?.discountCodes;
          this.form.patchValue({
            promoterIds: res['data'].promoterIds ? res['data'].promoterIds : '',
            dealName: res['data'].dealName ? res['data'].dealName : '',
            publicDealName: res['data'].publicDealName ? res['data'].publicDealName : '',
            firmId: res['data'].firmId ? res['data'].firmId : '',
            dealSiteLink: res['data'].dealSiteLink ? res['data'].dealSiteLink : '',
            dealNumber: res['data'].dealNumber ? res['data'].dealNumber : '',
            offerStartDate: res['data'].offerStartDate ? res['data'].offerStartDate : '',
            offerEndDate: res['data'].offerEndDate ? res['data'].offerEndDate : '',
            couponExpiryDate: res['data'].couponExpiryDate ? res['data'].couponExpiryDate : '',
            customerPrice: res['data'].customerPrice ? res['data'].customerPrice : '',
            dailyFirmPortion: res['data'].dailyFirmPortion ? res['data'].dailyFirmPortion : 0,
            charity: res['data'].charity ? res['data'].charity : 0,
            representative: res['data'].representative ? res['data'].representative : '',
            discount: res['data'].discount ? res['data'].discount : 0,
            stateIds: res['data'].stateIds ? res['data'].stateIds : '',
            industryIds: res['data'].industryIds ? res['data'].industryIds : '',
            merchantIds: res['data'].merchantIds ? res['data'].merchantIds : '',
            regionIds: res['data'].regionIds ? res['data'].regionIds : '',
            hideExpiryDate: res['data'].hideExpiryDate ? res['data'].hideExpiryDate : false,
            dealSpecificEmail: res['data'].dealSpecificEmail ? res['data'].dealSpecificEmail : false,
            startNotification: res['data'].startNotification ? res['data'].startNotification : false,
            inHouseDeal: res['data'].inHouseDeal ? res['data'].inHouseDeal : false,
            sortBy: res['data'].sortBy ? res['data'].sortBy : 'alphabatically',
            emailCC: res['data'].emailCC ? res['data'].emailCC : '',
            checkoutText: res['data'].checkoutText ? res['data'].checkoutText : '',
            buttonColorCode: res['data'].buttonColorCode ? res['data'].buttonColorCode : '',
            bannerColorCode: res['data'].bannerColorCode ? res['data'].bannerColorCode : '',
            textColorCode: res['data'].textColorCode ? res['data'].textColorCode : '',
            promoterPortion: res['data'].promoterPortion ? res['data'].promoterPortion : '',
            templateId: res['data'].templateId ? res['data'].templateId : '',
            active: res['data'].active ? res['data'].active : false,
          });
          if (res['data'].industryDetails.length > 0) {
            let industryDetailsArray = this.form.get('industryDetails') as FormArray;
            res['data'].industryDetails.forEach((el, i) => {
              industryDetailsArray.push(this.formBuilder.group({
                industryId: el.industryId,
                description: el.description,
                quantity: el.quantity,
                industryPortion: el.industryPortion,
                expiryDate: el.expiryDate,
                unit: el.unit
              }))
            });
            this.form.patchValue(industryDetailsArray)
          }
          if (res['data'].promoterPortionDetails.length > 0) {
            let promoterPortionArray = this.form.get('promoterPortionDetails') as FormArray;
            res['data'].promoterPortionDetails.forEach((el, i) => {
              promoterPortionArray.push(this.formBuilder.group({
                promoterId: el.promoterId,
                promoterPortion: el.promoterPortion
              }))
            });
            this.form.patchValue(promoterPortionArray)
          }
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }

  }
  ngOnInit(): void {
    if (!this.dealId) {
      this.getDealId();
    }
    this.getAllIndustries();
    this.getAllFirms();
    this.getAllPromoters();
    this.getDealTemplate();
    this.selectDealType = this.lookupService.getDealType();
    this.selectUnit = this.lookupService.getUnit();
  }
  getAllStates() {
    const sub = this.lookupService.getAllStates().subscribe({
      next: (res) => {
        this.selectStates = res['data'];

        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getDealTemplate() {
    const sub = this.lookupService.getDealTemplate().subscribe({
      next: (res) => {
        this.selectDealTemplate = res['data'];

        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getDealId() {
    const sub = this.dealService.getDealId().subscribe({
      next: (res) => {
        this.form.patchValue({
          dealNumber: res['data'] ? res['data'] : ''
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getAllIndustries() {
    const sub = this.lookupService.getAllIndustries().subscribe({
      next: (res) => {
        this.selectIndustry = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllFirms() {
    const sub = this.lookupService.getAllFirms().subscribe({
      next: (res) => {
        this.selectFirms = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getAllPromoters() {
    const sub = this.lookupService.getAllPromoters().subscribe({
      next: (res) => {
        this.selectPromotor = res['data'];
        if (this.roleName == 'Promoter') {
          this.form.patchValue({
            promoterIds: this.roleId
          });
          this.addPromoterDetails(this.roleId);
        }
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  uploadCheckoutLogo(event) {
    this.logo = event.target.files[0];
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.logoPreview = event.target.result;
      };
      reader.readAsDataURL(event.target.files[index]);
    }
  }
  checkBoolean(value) {
    if (value) {
      return true;
    }
    return false;
  }
  getRegionsByStateId(stateIds) {
    this.regionsByStateId = [];
    stateIds.forEach((stateId) => {
      this.RegionRefrence.forEach((x) => {
        if (x.stateId == stateId) {
          this.regionsByStateId.push(x);
        }
      })
    });
    this.selectRegion = this.regionsByStateId;
  }
  // getStateByMerchantId(merchantIds) {
  //   this.stateByMerchantId=[];
  //   merchantIds.forEach((merchantId)=>{
  //     this.stateReference.forEach((x)=>{
  //       if(x.merchantId==merchantId){
  //         this.stateByMerchantId.push(x);
  //       }
  //     })
  //   });
  //   this.selectStates=this.stateByMerchantId;  
  // }

  // get merchant by region ids
  getMerchantByRegionId(regionIds) {
    this.merchantByRegiontIds = [];
    regionIds.forEach((regionId) => {
      this.merchantReference.forEach((x) => {
        if (x.region.findIndex(x => x['_id'] == regionId) > -1) {
          if (this.merchantByRegiontIds.findIndex(y => y.value == x.value)==-1)
            this.merchantByRegiontIds.push(x);
        }
      })
    });
    console.log(this.merchantByRegiontIds)
    this.selectMerchant = this.merchantByRegiontIds;
  }
  // for discounts
  addNewDiscount(title, percentage) {
    if (this.index != -1) {
      let index = Number(this.index);
      let i = this.discounts[index];
      i.newDiscount = title;
      i.newDiscountPercentage = percentage;
      let newUrl = this.url.split('?')[0];
      this.index = -1;
      window.history.pushState('object', document.title, newUrl);
    }
    else {
      this.discounts.push({
        newDiscount: title,
        newDiscountPercentage: percentage
      });
    }

    this.form.controls['newDiscount'].reset();
    this.form.controls['newDiscountPercentage'].reset();
  }

  editDiscount(title, percent, i) {
    this.form.patchValue({
      newDiscount: title,
      newDiscountPercentage: percent
    });
    this.router.navigate([], { queryParams: { index: i } });
  }
  deleteDiscount(i) {
    this.discounts.splice(i, 1);
  }

  //for promoter formArrays 

  get promoterPortionDetails(): FormArray {
    return this.form.get("promoterPortionDetails") as FormArray
  }
  newPromoterPortionDetail(id): FormGroup {
    return this.formBuilder.group({
      promoterId: id,
      promoterPortion: ["", [Validators.required, Validators.min(0), Validators.max(100)]]
    })
  }
  addPromoterPortion(id) {
    this.promoterPortionDetails.push(this.newPromoterPortionDetail(id));
    this.cdRef.detectChanges();
  }
  addPromoterDetails(event) {
    if (event.length > 0) {
      if (this.selectedPromoterId.length < event.length) {
        if (this.selectedPromoterId.length > 0) {
          event.forEach(id => {
            if (!this.selectedPromoterId.includes(id)) {
              this.selectedPromoterId.push(id);
              this.addPromoterPortion(id);
            }
          })
        }
        else {
          this.selectedPromoterId.push(event[0]);
          this.addPromoterPortion(event[0]);
        }
      } else {
        const removedItems = this.selectedPromoterId.filter((element) => !event.includes(element));
        removedItems.forEach(el => {
          const removeSelectedItem = this.selectedPromoterId.indexOf(el);
          let index = this.industryDetails.controls.findIndex( // Find item from controls.
            (x) => x.value.promoterId == el
          );
          this.selectedPromoterId.splice(removeSelectedItem, 1);
          this.removePromoterDetail(index);
        })
      }

    } else {
      this.selectedPromoterId = [];
      (this.form.controls['promoterPortionDetails'] as FormArray).clear();
    }
  }
  removePromoterDetail(i: number) {
    this.promoterPortionDetails.removeAt(i);

  }
  findName(list: lookupdata[], id: string, keyId: string = "value", keyName: string = "name"): string {
    let item = list.filter(e => e[keyId] == id);
    return (item.length > 0) ? item[0][keyName] : "";
  }
  //for industry formArrays

  get industryDetails(): FormArray {
    return this.form.get("industryDetails") as FormArray
  }

  newIndustryDetail(id): FormGroup {
    return this.formBuilder.group({
      industryId: id,
      description: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      industryPortion: ["", [Validators.max(100), Validators.min(0)]],
      expiryDate: ["", [Validators.required]],
      unit: ["", [Validators.required]]

    })
  }

  addIndustryDetail(id) {
    this.industryDetails.push(this.newIndustryDetail(id));
    this.cdRef.detectChanges();
  }

  removeIndustryDetail(i: number) {
    this.industryDetails.removeAt(i);
  }
  getDataByIndustryId(event) {
    if (event.length > 0) {
      const sub = this.lookupService.getDataByIndustryId(event).subscribe({
        next: (res) => {
          this.selectMerchant = res['data'].merchants;
          this.merchantReference = res['data'].merchants;
          this.selectStates = res['data'].states;
          this.selectRegion = res['data'].regions;
          this.RegionRefrence = res['data'].regions;
          this.stateReference = res['data'].states;
          if (this.selectedIndustryId.length < event.length) {
            if (this.selectedIndustryId.length > 0) {
              event.forEach(id => {
                if (!this.selectedIndustryId.includes(id)) {
                  this.selectedIndustryId.push(id);
                  this.addIndustryDetail(id);
                }
              })

            }
            else {
              this.selectedIndustryId.push(event[0]);
              this.addIndustryDetail(event[0]);
              // if(!this.dealId){
              // }
            }
          } else {
            const removedItems = this.selectedIndustryId.filter((element) => !event.includes(element));
            if (removedItems.length > 0) {
              removedItems.forEach(el => {
                const removeSelectedItem = this.selectedIndustryId.indexOf(el);
                let index = this.industryDetails.controls.findIndex( // Find item from controls.
                  (x) => x.value.industryId == el
                );
                this.selectedIndustryId.splice(removeSelectedItem, 1);
                this.removeIndustryDetail(index);
              })
            }
          }
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        }
      })
    } else {
      this.selectedIndustryId = [];
      (this.form.controls['industryDetails'] as FormArray).clear();
    }
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.discountCodes = this.discounts;
      data.offerStartDate = changeDateToApiFormat(data.offerStartDate);
      data.offerEndDate = changeDateToApiFormat(data.offerEndDate);
      data.couponExpiryDate = changeDateToApiFormat(data.couponExpiryDate);
      data.industryDetails.forEach(x => {
        x.expiryDate = changeDateToApiFormat(x.expiryDate);
      })
      if (this.dealId != null) {
        const sub = this.dealService.updateDeal(this.dealId, data, this.logo).subscribe({
          next: (res) => {
            this.toaster.success('Deal Updated Successfully', 'Updated');
            this.router.navigate(['/deals'], { queryParams: this.queryParams });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.dealService.createDeal(data, this.logo).subscribe({
          next: (res) => {
            this.toaster.success('Deal Created Successfully', 'Created');
            this.router.navigate(['/deals'], { queryParams: this.queryParams });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }

    }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}

