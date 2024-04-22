import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private http: HttpClient) { }



  getAllTickets(params) {
    return this.http.get(environment.api + 'tickets', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleTicket(id) {
    return this.http.get(environment.api + 'tickets/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  getTicketDetails(data) {
    return this.http.get(environment.api + 'redeem-tickets', { params: data }).pipe(map((res) => {
      return res;
    })
    );
  }
  redeemTicket(data) {
    return this.http.post(environment.api + 'redeem-tickets', data).pipe(map((res) => {
      return res;
    })
    );
  }
  getLocationsLookup(industryId,couponId) {
    return this.http.get(environment.api + 'redeem-tickets/' + industryId,{params:{couponId}}).pipe(map((res) => {
      return res;
    })
    );
  }
  deleteTicket(id) {
    return this.http.delete(environment.api + 'tickets/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
