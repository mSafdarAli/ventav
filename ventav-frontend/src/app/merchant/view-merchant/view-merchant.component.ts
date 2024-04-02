
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { MerchantService } from 'src/_services/rest/merchant.service';

@Component({
  selector: 'app-view-merchant',
  templateUrl: './view-merchant.component.html',
  styleUrls: ['./view-merchant.component.scss']
})
export class ViewMerchantComponent implements OnInit, OnDestroy {
    routSub: Subscription = null;
    routQSub: Subscription = null;
    queryParams: Params = {};
    merchantId: string = '';
    data:any;
    constructor(
      private route: ActivatedRoute,
      private merchantService: MerchantService,
    
    ) {
      this.routSub = this.route.params.subscribe((params) => {
        this.merchantId = params['id'];
      });
      this.routQSub = this.route.queryParams.subscribe((qparams) => {
        this.queryParams = qparams;
      });
     }
   
     ngOnInit(): void {
    
      if(this.merchantId){
        const sub = this.merchantService.getSingleMerchant(this.merchantId).subscribe({
          next: res => {
            this.data=res['data'];
            sub.unsubscribe();
          }, error: res => {
            sub.unsubscribe();
          }
        });
      }
    }
    
    ngOnDestroy(): void {
      this.routSub.unsubscribe();
      this.routQSub.unsubscribe();
    }
  }




