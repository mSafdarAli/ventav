import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
	providedIn: 'root',
})
export class IndustryService {
	constructor(private http: HttpClient) { }



	getAllIndustry(params) {
		return this.http.get(environment.api + 'industries', { params: params }).pipe(map((res) => {
			return res;
		})
		);
	}
	getSingleIndustry(id) {
		return this.http.get(environment.api + 'industries/' + id).pipe(map((res) => {
			return res;
		})
		);
	}
	getIndustryQuestions(id) {
		return this.http.get(environment.api + 'industries/redeemData/' + id).pipe(map((res) => {
			return res;
		})
		);
	}
	public createIndustry(ticket, other, data) {
		const uploadData = new FormData();

		if (data.questions.length > 0) {
			data.questions.forEach(el => {
				uploadData.append('questions[]', JSON.stringify(el));
			});
		}
		if (ticket.length > 0) {
			ticket.forEach(el => {
				uploadData.append('ticketImage', el, el.name);
			});
		}
		if (other.length > 0) {
			other.forEach(el => {
				uploadData.append('dealPageImages', el, el.name);
			});
		}
		uploadData.append("name", data["name"]);
		uploadData.append("buttonColorCode", data["buttonColorCode"]);
		uploadData.append("textColorCode", data["textColorCode"]);
		uploadData.append("redumptionSuccessMessage", data["redumptionSuccessMessage"]);
		uploadData.append("redumptionAlreadyMessage", data["redumptionAlreadyMessage"]);
		uploadData.append("active", data["active"]);
		uploadData.append("ticketText", data["ticketText"]);
		uploadData.append("imageText", data["imageText"]);
		return this.http.post(environment.api + 'industries', uploadData).pipe(map(res => {
			return res;
		}));
	}
	public updateIndustry(id, ticket, other, data) {
		const uploadData = new FormData();
		if (data.questions.length > 0) {
			data.questions.forEach(el => {
				uploadData.append('questions[]', JSON.stringify(el));
			});
		}
		if (ticket.length > 0) {
			ticket.forEach(el => {
				uploadData.append('ticketImage', el, el.name);
			});
		}
		if (other.length > 0) {
			other.forEach(el => {
				uploadData.append('dealPageImages', el, el.name);
			});
		}
		uploadData.append("name", data["name"]);
		uploadData.append("buttonColorCode", data["buttonColorCode"]);
		uploadData.append("textColorCode", data["textColorCode"]);
		uploadData.append("redumptionSuccessMessage", data["redumptionSuccessMessage"]);
		uploadData.append("redumptionAlreadyMessage", data["redumptionAlreadyMessage"]);
		uploadData.append("active", data["active"]);
		uploadData.append("ticketText", data["ticketText"]);
		uploadData.append("imageText", data["imageText"]);
		return this.http.put(environment.api + 'industries/' + id, uploadData).pipe(map(res => {
			return res;
		}));
	}

	deleteIndustry(id) {
		return this.http.delete(environment.api + 'industries/' + id).pipe(map((res) => {
			return res;
		})
		);
	}


}
