import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Optional, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/_models';
import { AuthService } from 'src/_services/auth.service';
import { PermissionService } from 'src/_services/permission.service';
import { LeftMenuService } from 'src/_services/rest/leftMenu.service';
import { environment } from "src/environments/environment";
// import { AuthService } from 'src/_services/common/auth.service';
// import { MessageService } from 'src/_services/common/message.service';

// import { ChangePasswordPopupComponent } from '../change-password-popup/change-password-popup.component';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {

  naviIteam: any[] = [
    {
      label: 'Dashboard',
      icon: 'bi-bar-chart',
      url: 'dashboard',
      component:'dashboard',
      permission:'view'
    },
    {
      label: 'Master Data',
      icon: 'bi-clipboard-data',
      url: 'masterdata',
      component:'dashboard',
      permission:'view',
      childs: [
        {
          label:'Industry',
          icon: 'bi-building',
          url: '/industries',
          component:'industry',
          permission:'view'
        },
        {
          label:'Region',
          icon: 'bi-globe-asia-australia',
          url: '/regions',
          component:'region',
          permission:'view'
        },
        {
          label:'Deal Firm',
          icon: 'bi-buildings-fill',
          url: '/firms',
          component:'dealFirm',
          permission:'view'
        },
        {
          label:'Country',
          icon: 'bi-flag',
          url: '/countries',
          component:'country',
          permission:'view'
        },
        {
          label:'Email Templates',
          icon: 'bi-envelope',
          url: '/email-templates',
          component:'emailTemplate',
          permission:'view'
        },
        {
          label:'Admin Templates',
          icon: 'bi-envelope',
          url: '/admin-templates',
          component:'adminTemplate',
          permission:'view'
        },
        {
          label:'State',
          icon: 'bi-bank',
          url: '/states',
          component:'state',
          permission:'view'
        },
        {
          label:'Role',
          icon: 'bi-person-gear',
          url: '/roles',
          component:'role',
          permission:'view'
        },
        {
          label:'Permissions',
          icon: 'bi-shield-check',
          url: '/permissions',
          component:'permission',
          permission:'view'
        },
      ]
    },
    {
      label:'Merchant',
      icon: 'bi-shop',
      url: 'merchant',
      component:'merchant',
      permission:'view'
    },
    {
      label:'Deals',
      icon: 'bi-tags',
      url: 'deals',
      component:'deal',
      permission:'view'
    },
    {
      label:'Coupon',
      icon: 'bi-cash',
      url: 'coupons',
      component:'coupon',
      permission:'view'
    },
    {
      label:'Tickets',
      icon: 'bi-ticket-perforated',
      url: 'tickets',
      component:'ticket',
      permission:'view'
    },
    {
      label: 'User Management',
      icon: 'bi-people',
      url: 'user-management',
      component:'user',
      permission:'view'
    }
  ];
  topmenu: boolean = false;
  sideBarStatus: Observable<boolean>;
  companyName: string = '';
  userInfo: User = null;
  activeUrl = "";
  reportUrl = "";
  constructor(
    // @Optional() private dialogRef: MatDialogRef<ChangePasswordPopupComponent>,
    private dialog: MatDialog, private _authService: AuthService, private _leftMenuService: LeftMenuService,
    public ps:PermissionService,
    private router: Router,
  ) {
    this.activeUrl = this.router.url;
    this.sideBarStatus = this._leftMenuService.Isleftbar;
    this.userInfo = this._authService.userDetails;
  }
  navigateChild(url: string, event) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigateByUrl(url);
  }
 
  ngOnInit(): void {
    

  }


  // newDialog() {
  //   const DialogRef = this.dialog.open(ChangePasswordPopupComponent, {
  //     data: { email: this._authService.userDetails.unique_name },
  //     width: '30%',
  //     height: '70%',
  //     disableClose: true
  //   });

  // }
  logout() {
    this._authService.logout();
  }
 
  closeMenu() {
    this._leftMenuService.toggleSidebar();
  }
}
