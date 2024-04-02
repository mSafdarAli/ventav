import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService {
  constructor(private http: HttpClient) { }



  getAllTemplates(params) {
    return this.http.get(environment.api + 'emailTemplate/list/templates', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleTemplate(id) {
    return this.http.get(environment.api + 'emailTemplate/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  getTemplatFields(id) {
    return this.http.get(environment.api + 'emailTemplate/get/template-Fields/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  duplicateTemplate(id) {
    return this.http.post(environment.api + 'emailTemplate/duplicate/' + id,{}).pipe(map((res) => {
      return res;
    })
    );
  }
  getTemplateDetail(id,params=null) {
    return this.http.get(environment.api + 'emailTemplate/get/details/' + id,{params:params}).pipe(map((res) => {
      return res;
    })
    );
  }

  createTemplate(data) {
    return this.http.post(environment.api + 'emailTemplate', data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateTemplate(id, data) {
    return this.http.put(environment.api + 'emailTemplate/' + id, data).pipe(map((res) => {
      return res;
    })
    );
  }
  updateStatus(templateId: string, id: string) {
    return this.http.put(environment.api + 'emailTemplate/updateStatus/' + id, { templateId }).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteTemplate(id) {
    return this.http.delete(environment.api + 'emailTemplate/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
