import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) { }



  getDealDetails(id) {
    return this.http.get(environment.api + 'checkout/getDeal/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
