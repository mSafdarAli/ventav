import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LeftMenuService } from 'src/_services/rest/leftMenu.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  menu: boolean = true;
  constructor(private leftBarService: LeftMenuService) { }

  ngOnInit(): void {
  }

  showMenu() {
    this.leftBarService.toggleSidebar();
  }
}
