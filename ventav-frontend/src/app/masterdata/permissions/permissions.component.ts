import { Component, OnInit } from '@angular/core';
import { SystemPermissionsService } from 'src/_services/rest/systemPermissions.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  dataSource:any={};
  id:string='';
  constructor(
    private permissionService:SystemPermissionsService
  ) { 

  }

  ngOnInit(): void {
    this.getAllPermissions();
  }
  getAllPermissions(params=null){
    const sub = this.permissionService.getAllPermissions().subscribe({
      next: (res) => {
        this.id=res['data']._id;
        this.dataSource = res['data'].permissions;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getKeys(ob: object): string[] {
    return Object.keys(ob);
  }

}
