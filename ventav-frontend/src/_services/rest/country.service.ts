import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) { }

  

  getAllCountry(params) {
    return this.http.get(environment.api + 'countries', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleCountry(id) {
    return this.http.get(environment.api + 'countries/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createCountry(data) {
    return this.http.post(environment.api + 'countries', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateCountry(id, data) {
    return this.http.put(environment.api + 'countries/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteCountry(id) {
    return this.http.delete(environment.api + 'countries/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
