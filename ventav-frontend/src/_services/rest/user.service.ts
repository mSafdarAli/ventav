import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    public getAllUsers(params) {
        return this.http.get(environment.api + 'users', { params: params }).pipe(map(res => {
            return res;
        }));
    }
    public getSingleUser(id) {
        return this.http.get(environment.api + 'users/' + id).pipe(map(res => {
            return res;
        }));
    }
    public createUser(data) {
        return this.http.post(environment.api + 'users', data).pipe(map(res => {
            return res;
        }));
    }
    public updateUser(id, data) {
        return this.http.put(environment.api + 'users/' + id, data).pipe(map(res => {
            return res;
        }));
    }
    public deleteUser(id) {
        return this.http.delete(environment.api + 'users/' + id).pipe(map(res => {
            return res;
        }));
    }
    // public createAccount(file, data) {
    //     const uploadData = new FormData();
    //     if (file.length > 0) {
    //         file.forEach(el => {
    //             uploadData.append('logo', el, el.name);
    //         });
    //     }
    //     uploadData.append("name", data["name"]);
    //     uploadData.append("compnay", data["compnay"]);
    //     uploadData.append("email", data["email"]);
    //     uploadData.append("password", data["password"]);
    //     uploadData.append("preferredUrl", data["preferredUrl"]);
    //     uploadData.append("ticketTemplate", data["ticketTemplate"]);
    //     uploadData.append("privileges", data["privileges"]);
    //     uploadData.append("approved", data["approved"]);
    //     uploadData.append("timeZone", data["timeZone"]);
    //     return this.http.post(environment.api + 'users', uploadData).pipe(map(res => {
    //         return res;
    //     }));
    // }
    // public updateAccount(id, file, data) {
    //     const uploadData = new FormData();
    //     if (file.length > 0) {
    //         file.forEach(el => {
    //             uploadData.append('logo', el, el.name);
    //         });
    //     }
    //     uploadData.append("name", data["name"]);
    //     uploadData.append("compnay", data["compnay"]);
    //     uploadData.append("email", data["email"]);
    //     uploadData.append("password", data["password"]);
    //     uploadData.append("preferredUrl", data["preferredUrl"]);
    //     uploadData.append("ticketTemplate", data["ticketTemplate"]);
    //     uploadData.append("privileges", data["privileges"]);
    //     uploadData.append("approved", data["approved"]);
    //     uploadData.append("timeZone", data["timeZone"]);
    //     return this.http.post(environment.api + 'users/' + id, uploadData).pipe(map(res => {
    //         return res;
    //     }));
    // }
}