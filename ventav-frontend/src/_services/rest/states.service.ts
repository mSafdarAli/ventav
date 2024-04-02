import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class StatesService {
  constructor(private http: HttpClient) { }

  

  getAllStates(params) {
    return this.http.get(environment.api + 'states', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleState(id) {
    return this.http.get(environment.api + 'states/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createState(data) {
    return this.http.post(environment.api + 'states', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateState(id, data) {
    return this.http.put(environment.api + 'states/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteState(id) {
    return this.http.delete(environment.api + 'states/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
