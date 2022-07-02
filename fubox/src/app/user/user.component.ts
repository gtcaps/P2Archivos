import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userLoged:string;

  constructor(private route:Router) {
    this.userLoged = "";
  }

  ngOnInit(): void {
    this.userLoged = this.getUserLoged();
    console.log(`->${this.userLoged}<-`);
    this.redirectUser(this.userLoged);
  }

  private getUserLoged(): string {
    let userLoged = "";
    let cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      let cookieSplit = cookie.trim().split('=');
      if (cookieSplit[0] === 'loged') {
        userLoged = cookieSplit[1].trim();
      }
    });

    return userLoged;
  }

  private redirectUser(user: string): void {
    if (user === '' || user === 'admin') {
      this.route.navigate(['/access-denied']);
    }
  }

  closeSession(): void {
    document.cookie = "loged=;"
  }

}
