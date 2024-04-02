import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  constructor(private http: HttpClient) { }

  

  getAllMerchant(params) {
    return this.http.get(environment.api + 'merchants', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleMerchant(id) {
    return this.http.get(environment.api + 'merchants/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createMerchant(data) {
    return this.http.post(environment.api + 'merchants', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateMerchant(id, data) {
    return this.http.put(environment.api + 'merchants/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteMerchant(id) {
    return this.http.delete(environment.api + 'merchants/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
