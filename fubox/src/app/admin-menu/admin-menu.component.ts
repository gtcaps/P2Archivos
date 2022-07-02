import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  menuOption:string ;

  constructor() {
    this.menuOption = "usuarios";
  }

  ngOnInit(): void {
  }

  closeSession(): void {
    document.cookie = "loged=;"
  }


}
