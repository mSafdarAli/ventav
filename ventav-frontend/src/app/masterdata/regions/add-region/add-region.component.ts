import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { RegionService } from 'src/_services/rest/region.service';
import { AdvanceSearchComponent } from 'src/app/dashboard/advance-search/advance-search.component';

@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.scss']
})
export class AddRegionComponent implements OnInit,OnDestroy {
  regionId: string = '';
  form: FormGroup;
  selectState: lookupdata[] = [];
  registedStates:any[]=[];
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams:Params={};
  constructor(
    private formBuilder: FormBuilder,
    private lookupService:LookUpService,
    private regionService:RegionService,
    private toaster: ToastrService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      stateId: ['',[Validators.required]],
      name: ['',[Validators.required]]
    });
    this.routSub = this.route.params.subscribe((params) => {
      this.regionId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    if(this.regionId!=null){
      const sub = this.regionService.getSingleRegion(this.regionId).subscribe({
        next: (res) => {
          this.getRegisteredRegions(res['data'].stateId);
          this.form.patchValue({
            name:res['data'].name?res['data'].name:'',
            stateId:res['data'].stateId?res['data'].stateId:''
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
    this.getAllStates();
  }
  getAllStates() {
    const sub = this.lookupService.getAllStates().subscribe({
      next: (res) => {
        this.selectState = res['data'];

        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getRegisteredRegions(state) {
    const sub = this.regionService.getRegisteredRegions(state).subscribe({
      next: (res) => {
        this.registedStates = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  submit(){
    if(this.form.valid){
      if(this.regionId!=null){
        const sub = this.regionService.updateRegion(this.regionId,this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Region Updated Successfully', 'Updated');
            this.router.navigate(['/masterdata/regions'],{queryParams:this.queryParams});
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else{
        const sub = this.regionService.createRegion(this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('Region Created Successfully', 'Created');
            this.router.navigate(['/masterdata/regions'],{queryParams:this.queryParams});
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
