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

  deleteTicket(id) {
    return this.http.delete(environment.api + 'tickets/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
