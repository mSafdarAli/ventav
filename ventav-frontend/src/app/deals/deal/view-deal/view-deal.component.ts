import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { DealService } from 'src/_services/rest/deal.service';

@Component({
  selector: 'app-view-deal',
  templateUrl: './view-deal.component.html',
  styleUrls: ['./view-deal.component.scss']
})
export class ViewDealComponent implements OnInit {

  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  dealId: string = '';
  data:any;
  constructor(
    private route: ActivatedRoute,
    private dealService: DealService,
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.dealId = params['id'];
    });
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
    });
   }
 
  ngOnInit(): void {

    if(this.dealId){
      const sub = this.dealService.getSingleDeal(this.dealId).subscribe({
        next: res => {
        
          this.data=res['data'];
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
  }

}
