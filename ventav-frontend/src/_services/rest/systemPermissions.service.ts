import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class SystemPermissionsService {
  constructor(private http: HttpClient) { }



  getAllPermissions() {
    return this.http.get(environment.api + 'permissions').pipe(map((res) => {
      return res;
    })
    );
  }
  
  createPermission(id, data) {
    return this.http.put(environment.api + 'permissions/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }



}
