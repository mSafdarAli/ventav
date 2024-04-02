import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class RedeemService {
  constructor(private http: HttpClient) { }

  redeemCoupon(data) {
    return this.http.post(environment.api + 'redeem', data).pipe(map((res) => {
      return res;
    })
    );
  }
  getIndustry(id) {
    return this.http.get(environment.api + 'redeem/getIndustry/'+id).pipe(map((res) => {
      return res;
    })
    );
  }
  getStatesAndRegions(redemptionCode) {
    return this.http.post(environment.api + 'redeem/getStates',{redemptionCode}).pipe(map((res) => {
      return res;
    })
    );
  }


}
