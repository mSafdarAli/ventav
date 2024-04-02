import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Role } from 'src/_models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) { }

  

  getAllRoles(params) {
    return this.http.get(environment.api + 'roles', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleRole(id) {
    return this.http.get<Role>(environment.api + 'roles/' + id);
  }

  createRole(data) {
    return this.http.post(environment.api + 'roles', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateRole(id, data) {
    return this.http.put(environment.api + 'roles/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteRole(id) {
    return this.http.delete(environment.api + 'roles/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
