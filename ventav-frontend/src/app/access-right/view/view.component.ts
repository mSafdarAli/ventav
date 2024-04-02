import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/_services/rest/user.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  routSub: Subscription = null;
  routQSub: Subscription = null;
  queryParams: Params = {};
  userId: string = '';
  data:any;
  constructor(
    private userService:UserService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
      this.routSub = this.route.params.subscribe((params) => {
        this.userId = params['id'];
      });
      this.routQSub = this.route.queryParams.subscribe((qparams) => {
        this.queryParams = qparams;
      });
     }

  ngOnInit(): void {
    if(this.userId){
      const sub = this.userService.getSingleUser(this.userId).subscribe({
        next: res => {
          this.data=res['data'];
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
  }
  close() {
   
  }
  EditUser() {
    this.router.navigate(['user-management/edit-user', this.userId]);
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.routQSub.unsubscribe();
  }
}

