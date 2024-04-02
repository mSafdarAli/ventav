import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';



@Injectable({
	providedIn: 'root'
})
export class PermissionService {
	constructor(private authService: AuthService, private http: HttpClient) {
	}
	public havePerm(component: string, permission): boolean {
		if (this.authService.userDetails && this.authService.userDetails.role.permissions[component] != undefined && this.authService.userDetails.role.permissions[component][permission] == true) {
			return true;
		}
		return false;
	}
}
