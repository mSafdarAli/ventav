import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StatesService } from 'src/_services/rest/states.service';

@Component({
  selector: 'app-add-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.scss']
})
export class AddStateComponent implements OnInit,OnDestroy {
  stateId: string = '';
  form: FormGroup;
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams:Params={};
  constructor(
    private formBuilder: FormBuilder,
    private stateService:StatesService,
    private toaster: ToastrService,
    private router:Router,
    private route:ActivatedRoute
  ) { 
    this.form = this.formBuilder.group({
      name: ['',[Validators.required]],
      abbreviation: ['',[Validators.required]]
    });
    this.routSub = this.route.params.subscribe((params) => {
      this.stateId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
    if(this.stateId!=null){
      const sub = this.stateService.getSingleState(this.stateId).subscribe({
        next: (res) => {
          this.form.patchValue({
            name:res['data'].name?res['data'].name:'',
            abbreviation:res['data'].abbreviation?res['data'].abbreviation:''
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
      if(this.stateId!=null){
        const sub = this.stateService.updateState(this.stateId,this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('State Updated Successfully', 'Updated');
            this.router.navigate(['/masterdata/states'],{queryParams:this.queryParams});
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else{
        const sub = this.stateService.createState(this.form.value).subscribe({
          next: (res) => {
            this.toaster.success('State Created Successfully', 'Created');
            this.router.navigate(['/masterdata/states'],{queryParams:this.queryParams});
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