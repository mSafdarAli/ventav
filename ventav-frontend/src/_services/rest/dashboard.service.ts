import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  getDashboardData(queryParams = null) {

    return this.http.get(environment.api + 'dashboard',{params:queryParams}).pipe(map((res) => {
      return res;
    })
    );
  }


}
