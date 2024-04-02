import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CouponService {
  constructor(private http: HttpClient) { }



  getAllCoupons(params) {
    return this.http.get(environment.api + 'coupons', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getCouponCodes(data) {
    return this.http.post(environment.api + 'coupons/get/export', data).pipe(map((res) => {
      return res;
    })
    );
  }
  redeemCoupon(data) {
    return this.http.post(environment.api + 'redeem', data).pipe(map((res) => {
      return res;
    })
    );
  }

  createCoupon(data) {
    return this.http.post(environment.api + 'coupons', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateEmail(id, email) {
    return this.http.put(environment.api + 'coupons/' + id, {email:email}).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteCoupon(id) {
    return this.http.delete(environment.api + 'coupons/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
