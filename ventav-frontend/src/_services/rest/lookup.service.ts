import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class LookUpService {
  constructor(private http: HttpClient) { }

  public getYears() {
    const years: any[] = [];
    const currentYear = moment().year();
    for (let i = 0; i < 15; i++) {
      years.push({ name: currentYear + i, value: currentYear + i });
    }
    return years;
  }
 
  public getRating() {
    return [
      { name: '1', value: '1' },
      { name: '2', value: '2' },
      { name: '3', value: '3' }
    ];
  }
  public getImportType() {
    return [
      { name: 'Industry General', value: '1' },
      { name: 'Region Specific', value: '2' }
    ];
  }
  public getMerchantStatus() {
    return [
      { name: 'Regular', value: 'regular' },
      { name: 'Dormant', value: 'dormant' },
      { name: 'Hotlist', value: 'hotlist' }
    ];
  }
  public getMerchantLanguage() {
    return [
      { name: 'English', value: 'english' },
      { name: 'French', value: 'french' },
      { name: 'German', value: 'German' }
    ];
  }
  public getDealType() {
    return [
      { name: 'Single Quantity', value: 'singleQuantity' },
      { name: 'Multiple Quantity', value: 'MultipleQuantity' }
    ];
  }
  public getUnit() {
    return [
      { name: 'Percent', value: 'percent' },
      { name: 'Dollar', value: 'dollar' }
    ];
  }
  public getRedeemStatus() {
    return [
      { name: 'Yes', value: 'true' },
      { name: 'No', value: 'false' }
    ];
  }
  public getMerchantPosition() {
    return [
      { name: 'A', value: 'A' },
      { name: 'B', value: 'B' },
      { name: 'C', value: 'C' },
      { name: 'D', value: 'D' }
    ];
  }
  public getPrivileges() {
    return [
      { name: 'Promoter', value: 'promoter' }
    ];
  }
  public getTicketTemplate() {
    return this.http.get(environment.api + 'lookup/getStates').pipe(
      map((res) => {
        return res;
      })
    );
  }
  public getTimeZone() {
    return [
      { name: 'Pacific/Hawaii', value: 'hawaii' },
      { name: 'Pacific', value: 'pacific' },
      { name: 'Mountain', value: 'mountain' },
      { name: 'Eastern', value: 'eastern' },
      { name: 'Atlantic', value: 'atlantic' },
    ];
  }
  public getCardType() {
    return [
      { name: 'American Express', value: 'AmericanExpress' },
      { name: 'Discover', value: 'discover' },
      { name: 'Visa', value: 'visa' },
      { name: 'MasterCard', value: 'MasterCard' }
    ];
  }
  public getAllIndustries() {
    return this.http.get(environment.api + 'lookup/getIndustries').pipe(
      map((res) => {
        return res;
      })
    );
  }
  public getAllPromoters() {
    return this.http.get(environment.api + 'lookup/getPromoters').pipe(
      map((res) => {
        return res;
      })
    );
  }
  public getAllStates() {
    return this.http.get(environment.api + 'lookup/getStates').pipe(
      map((res) => {
        return res;
      })
    );
  }
  public getAllRoles() {
    return this.http.get(environment.api + 'lookup/getRoles').pipe(
      map((res) => {
        return res;
      })
    );
  }
  public getAllMerchants() {
    return this.http.get(environment.api + 'lookup/getMerchants').pipe(
      map((res) => {
        return res;
      })
    );
  }
  getRegionByStateId(id) {
    return this.http.get(environment.api + 'lookup/getRegions/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  
  getAllFirms() {
    return this.http.get(environment.api + 'lookup/getFirms').pipe(map((res) => {
      return res;
    })
    );
  }
  getAllDealLookup() {
    return this.http.get(environment.api + 'lookup/getDeals').pipe(map((res) => {
      return res;
    })
    );
  }
  getDealTemplate() {
    return this.http.get(environment.api + 'lookup/getDealTemplates').pipe(map((res) => {
      return res;
    })
    );
  }
  getDataByIndustryId(industryId) {
    return this.http.get(environment.api + 'lookup/getDealData/'+industryId).pipe(map((res) => {
      return res;
    })
    );
  }
  
  
  
}