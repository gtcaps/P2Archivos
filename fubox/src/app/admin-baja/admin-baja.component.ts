import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-baja',
  templateUrl: './admin-baja.component.html',
  styleUrls: ['./admin-baja.component.scss']
})
export class AdminBajaComponent implements OnInit {

  dataUsers:any;
  loader:boolean;

  constructor(private route:Router) {
    this.loader = false;
  }

  ngOnInit(): void {
    let userLoged = this.getUserLoged();
    this.redirectUser(userLoged);

    // Obtener data
    fetch('http://127.0.0.1:3030/users')
    .then(response => response.json())
    .then(response => {
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

  private async deleteApi(email:string): Promise<any> {
    this.loader = true;
    let deleteRequest = await fetch('http://127.0.0.1:3030/users/delete', {
      method: "DELETE",
      body: JSON.stringify({email: email}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let deleteStatus = await deleteRequest.json();

    if (deleteStatus.type === 'success') {

      let emailRequest = await fetch('http://fuboxapi.uaenorth.cloudapp.azure.com:3040/send-email', {
        method: "POST",
        body: JSON.stringify({
          "to": email,
          "subject": "Cancelacion de Cuenta",
          "text": "Su cuenta ha sido cancelada y borrada: " + email,
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        });

      let sendStauts = await emailRequest.json();
      if (sendStauts.type === 'success') {
        this.loader = false;
        alert("Se ha cancelado la cuenta");
        window.location.reload();
      }

    } else {
      alert("No se pudo eliminar al usuario: " + email);
    }

  }

  eliminarUsuario(email:string): void {
    console.log('Vamos a eliminar', email);
    this.deleteApi(email);
  }

}
