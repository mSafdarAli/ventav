import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class RegionService {
  constructor(private http: HttpClient) { }

  getRegisteredRegions(id) {
    return this.http.get(environment.api + 'regions/state/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  getAllRegions(params) {
    return this.http.get(environment.api + 'regions', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleRegion(id) {
    return this.http.get(environment.api + 'regions/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createRegion(data) {
    return this.http.post(environment.api + 'regions', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateRegion(id, data) {
    return this.http.put(environment.api + 'regions/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteRegion(id) {
    return this.http.delete(environment.api + 'regions/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
