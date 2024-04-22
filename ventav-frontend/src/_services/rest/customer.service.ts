import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) { }

  

  getAllCustomers(params) {
    return this.http.get(environment.api + 'customers', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
 


}
