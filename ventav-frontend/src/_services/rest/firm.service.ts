import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class FirmService {
  constructor(private http: HttpClient) { }

  

  getAllFirm(params) {
    return this.http.get(environment.api + 'firms', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleFirm(id) {
    return this.http.get(environment.api + 'firms/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createFirm(data) {
    return this.http.post(environment.api + 'firms', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateFirm(id, data) {
    return this.http.put(environment.api + 'firms/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteFirm(id) {
    return this.http.delete(environment.api + 'firms/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
