import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit {
  baseUrl: string = environment.baseUrl;
  url: string;
  @Input() path:string;
  @Input() id:string;
  constructor( private toaster: ToastrService,) {
  }

  ngOnInit(): void {
      this.url = this.baseUrl + this.path +'/' + this.id;
      
  }
 
  copyClipboard(event) {
    navigator.clipboard.writeText(event);
    this.toaster.success('Successfully', 'Copy');
  }
}