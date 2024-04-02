import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { IndustryService } from 'src/_services/rest/industry.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy{
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  industryId: string = '';
  data:any;
  constructor(
    private route: ActivatedRoute,
    private industryService:IndustryService,
  ) {
      this.routSub = this.route.params.subscribe((params) => {
        this.industryId = params['id'];
      });
      this.routQSub = this.route.queryParams.subscribe((qparams) => {
        this.queryParams = qparams;
      });
     }

  ngOnInit(): void {
    if(this.industryId){
      const sub = this.industryService.getSingleIndustry(this.industryId).subscribe({
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
