import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LeftMenuService {
    private leftBarSub = new BehaviorSubject<boolean>(false);
	Isleftbar = this.leftBarSub.asObservable();
    constructor(private http: HttpClient) { }

    public leftMenuData(id: string) {
        return this.http.get(environment.api + 'sitePages/getByUser/' + id).pipe(map(res => {
            return res;
        }))
    }

    public toggleSidebar() {
        this.leftBarSub.next(!this.leftBarSub.value);
    }

    public getReportUrl() {
        return this.http.get(environment.api + 'reports').pipe(map(res => {
            return res;
        }))
    }
}