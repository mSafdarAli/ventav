import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/_models';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-narrow-window',
  templateUrl: './narrow-window.component.html',
  styleUrls: ['./narrow-window.component.scss']
})
export class NarrowWindowComponent implements OnInit {
  userInfo: Observable<User>;
  constructor(private _authService: AuthService) {
    this._authService.updateUser();
    this.userInfo =this._authService.userInfo;
  }

  ngOnInit(): void {
  }

}
