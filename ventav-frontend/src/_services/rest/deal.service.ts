import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DealService {
  constructor(private http: HttpClient) { }


  public getDealId() {
    return this.http.get(environment.api + 'deals/get/dealCount').pipe(
      map((res) => {
        return res;
      })
    );
  }
  getAllDeal(params) {
    return this.http.get(environment.api + 'deals', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleDeal(id) {
    return this.http.get(environment.api + 'deals/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createDeal(data,logo) {
    const uploadData = new FormData();  
    uploadData.append('checkoutLogo',logo,logo.name);    
    uploadData.append("templateId", data["templateId"]);
    if (data.promoterIds.length > 0) {
			data.promoterIds.forEach(el => {
				uploadData.append('promoterIds[]', el);
			});
		}
    uploadData.append("dealName", data["dealName"]);
    uploadData.append("dealNumber", data["dealNumber"]);
    uploadData.append("publicDealName", data["publicDealName"]);
		uploadData.append("firmId", data["firmId"]);
    uploadData.append("dealSiteLink", data["dealSiteLink"]);
    uploadData.append("offerStartDate", data["offerStartDate"]);
    uploadData.append("offerEndDate", data["offerEndDate"]);
    uploadData.append("couponExpiryDate", data["couponExpiryDate"]);
    uploadData.append("customerPrice", JSON.stringify(data["customerPrice"]));
    uploadData.append("dailyFirmPortion", JSON.stringify(data["dailyFirmPortion"]));
		uploadData.append("charity", JSON.stringify(data["charity"]));
    uploadData.append("representative", data["representative"]);
    uploadData.append("discount", JSON.stringify(data["discount"]));
    if (data.industryIds.length > 0) {
			data.industryIds.forEach(el => {
				uploadData.append('industryIds[]', el);
			});
		}
    if (data.stateIds.length > 0) {
			data.stateIds.forEach(el => {
				uploadData.append('stateIds[]', el);
			});
		}
    if (data.regionIds.length > 0) {
			data.regionIds.forEach(el => {
				uploadData.append('regionIds[]', el);
			});
		}
    if (data.merchantIds.length > 0) {
			data.merchantIds.forEach(el => {
				uploadData.append('merchantIds[]', el);
			});
		}
    if (data.industryDetails.length > 0) {
			data.industryDetails.forEach(el => {
				uploadData.append('industryDetails[]', JSON.stringify(el));
			});
		}
    if (data.promoterPortionDetails.length > 0) {
			data.promoterPortionDetails.forEach(el => {
				uploadData.append('promoterPortionDetails[]', JSON.stringify(el));
			});
		}
    if (data.discountCodes.length > 0) {
			data.discountCodes.forEach(el => {
				uploadData.append('discountCodes[]', JSON.stringify(el));
			});
		}
		uploadData.append("hideExpiryDate", JSON.stringify(data["hideExpiryDate"]));
    uploadData.append("dealSpecificEmail", JSON.stringify(data["dealSpecificEmail"]));
    uploadData.append("startNotification", JSON.stringify(data["startNotification"]));
    uploadData.append("inHouseDeal", JSON.stringify(data["inHouseDeal"]));
    uploadData.append("sortBy", data["sortBy"]);
    uploadData.append("emailCC", data["emailCC"]);
    uploadData.append("checkoutText", data["checkoutText"]);
    uploadData.append("active", JSON.stringify(data["active"]));
    uploadData.append("buttonColorCode", data["buttonColorCode"]);
    uploadData.append("bannerColorCode", data["bannerColorCode"]);
    uploadData.append("textColorCode", data["textColorCode"]);
    return this.http.post(environment.api + 'deals', uploadData).pipe(map((res) => {
      return res;
    })
    );
  }
  updateDeal(id, data,logo) {
    const uploadData = new FormData();  
    if(logo){
      uploadData.append('checkoutLogo',logo,logo.name);    
    }
    uploadData.append("templateId", data["templateId"]);
    if (data.promoterIds.length > 0) {
			data.promoterIds.forEach(el => {
				uploadData.append('promoterIds[]', el);
			});
		}
    uploadData.append("dealName", data["dealName"]);
    uploadData.append("dealNumber", data["dealNumber"]);
    uploadData.append("publicDealName", data["publicDealName"]);
		uploadData.append("firmId", data["firmId"]);
    uploadData.append("dealSiteLink", data["dealSiteLink"]);
    uploadData.append("offerStartDate", data["offerStartDate"]);
    uploadData.append("offerEndDate", data["offerEndDate"]);
    uploadData.append("couponExpiryDate", data["couponExpiryDate"]);
    uploadData.append("customerPrice", JSON.stringify(data["customerPrice"]));
    uploadData.append("dailyFirmPortion", JSON.stringify(data["dailyFirmPortion"]));
		uploadData.append("charity", JSON.stringify(data["charity"]));
    uploadData.append("representative", data["representative"]);
    uploadData.append("discount", JSON.stringify(data["discount"]));
    if (data.industryIds.length > 0) {
			data.industryIds.forEach(el => {
				uploadData.append('industryIds[]', el);
			});
		}
    if (data.stateIds.length > 0) {
			data.stateIds.forEach(el => {
				uploadData.append('stateIds[]', el);
			});
		}
    if (data.regionIds.length > 0) {
			data.regionIds.forEach(el => {
				uploadData.append('regionIds[]', el);
			});
		}
    if (data.merchantIds.length > 0) {
			data.merchantIds.forEach(el => {
				uploadData.append('merchantIds[]', el);
			});
		}
    if (data.industryDetails.length > 0) {
			data.industryDetails.forEach(el => {
				uploadData.append('industryDetails[]', JSON.stringify(el));
			});
		}
    if (data.promoterPortionDetails.length > 0) {
			data.promoterPortionDetails.forEach(el => {
				uploadData.append('promoterPortionDetails[]', JSON.stringify(el));
			});
		}
    if (data.discountCodes.length > 0) {
			data.discountCodes.forEach(el => {
				uploadData.append('discountCodes[]', JSON.stringify(el));
			});
		}
		uploadData.append("hideExpiryDate", JSON.stringify(data["hideExpiryDate"]));
    uploadData.append("dealSpecificEmail", JSON.stringify(data["dealSpecificEmail"]));
    uploadData.append("startNotification", JSON.stringify(data["startNotification"]));
    uploadData.append("inHouseDeal", JSON.stringify(data["inHouseDeal"]));
    uploadData.append("sortBy", data["sortBy"]);
    uploadData.append("emailCC", data["emailCC"]);
    uploadData.append("checkoutText", data["checkoutText"]);
    uploadData.append("active", JSON.stringify(data["active"]));
    uploadData.append("buttonColorCode", data["buttonColorCode"]);
    uploadData.append("bannerColorCode", data["bannerColorCode"]);
    uploadData.append("textColorCode", data["textColorCode"]);
    return this.http.put(environment.api + 'deals/' + id, uploadData).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteDeal(id) {
    return this.http.delete(environment.api + 'deals/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  changeDealStatus(id,active) {
    return this.http.put(environment.api + 'deals/updateStatus/' + id,active).pipe(map((res) => {
      return res;
    })
    );
  }
  // getRegionsByStateId(id) {
  //   return this.http.get(environment.api + 'regions/state/' + id).pipe(map((res) => {
  //     if (res) {
  //       var regionByStateId: lookupdata[] = [];
  //       res['data'].map(e => {
  //         regionByStateId.push({ name: e.name, value: e._id });

  //       });
  //       return regionByStateId;
  //     }
  //     return null
  //   })
  //   );
  // }

}
