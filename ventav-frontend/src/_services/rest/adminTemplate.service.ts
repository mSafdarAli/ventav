import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AdminTemplateService {
  constructor(private http: HttpClient) { }



  getAllAdminTemplate(params) {
    return this.http.get(environment.api + 'adminTemplate', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleAdminTemplate(id) {
    return this.http.get(environment.api + 'adminTemplate/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createAdminTemplate(data) {
    return this.http.post(environment.api + 'adminTemplate', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateAdminTemplate(id, data) {
    return this.http.put(environment.api + 'adminTemplate/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteAdminTemplate(id) {
    return this.http.delete(environment.api + 'adminTemplate/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
