import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirmService } from 'src/_services/rest/firm.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewFirmComponent implements OnInit,OnDestroy {
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  firmId: string = '';
  data:any;

     constructor(
      private route: ActivatedRoute,
      private firmService: FirmService,
    ) {
        this.routSub = this.route.params.subscribe((params) => {
          this.firmId = params['id'];
        });
        this.routQSub = this.route.queryParams.subscribe((qparams) => {
          this.queryParams = qparams;
        });
       }
  


  ngOnInit(): void {
    if(this.firmId){
      const sub = this.firmService.getSingleFirm(this.firmId).subscribe({
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
