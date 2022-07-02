import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


  dataUsers:any;
  loader:boolean;

  constructor(private route:Router) {
  
    this.loader = false;
  }

  ngOnInit(): void {
    let userLoged = this.getUserLoged();
    console.log(`->${userLoged}<-`);
    this.redirectUser(userLoged);

    // Obtener data
    fetch('http://127.0.0.1:3030/users')
    .then(response => response.json())
    .then(response => {
      console.log(response);
      this.dataUsers = response;
    });
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
    if (user !== 'admin') {
      this.route.navigate(['/access-denied']);
    }
  }

  // EnviarCorreon
  async sendEmail(email: string, status: string): Promise<any> {
    console.log("Activar al usuario", email);

    let userChangeStatus = await fetch('http://127.0.0.1:3030/users/activate', {
      method: "PATCH",
      body: JSON.stringify({email: email}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let responseStatus = await userChangeStatus.json();

    if (responseStatus.type === 'success') {
      this.loader = true;
      let emailSend = await fetch('http://fuboxapi.uaenorth.cloudapp.azure.com:3040/send-email', {
            method: "POST",
            body: JSON.stringify({
              "to": email,
              "subject": "Notificacion Cuenta",
              "text": "Se ha cambiado el estado de su cuenta: " + status,
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            });

      let sendStauts = await emailSend.json();
      if (sendStauts.type === 'success') {
        this.loader = false;
        alert("Se ha actualizado el estado de la cuenta");
        window.location.reload();
      }
      console.log("Notificacion enviada", sendStauts);
    }

  }

  // Activar al usuario
  activateUser(email:string, active:boolean): void {
    this.sendEmail(email, active === true ? 'Inactivo': 'Activo');
  }

}
