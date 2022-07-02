import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  errorMessage: string;

  constructor(private route:Router) {
    this.email = "";
    this.password = "";
    this.errorMessage = "";
  }

  ngOnInit(): void {
    let userLoged = this.getUserLoged();
    console.log(`->${userLoged}<-`);
    this.redirectUser(userLoged);

    localStorage.clear();
    localStorage.setItem('correoIntento', '');
    localStorage.setItem('intentos', '0');
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
    if (user === 'admin') {
      this.route.navigate(['/admin']);
    }else if (user !== '') {
      this.route.navigate(['/user']);
    }
  }

  initSession(): void {
    if (this.email.trim() === "" || this.password.trim() === "") {
      this.errorMessage = "Debes completar todos los campos";
      return;
    }

    this.errorMessage = "";

    let credentials = JSON.stringify({"email": this.email, "password": this.password});

    fetch('http://127.0.0.1:3030/users/login', {
      method: "POST",
      body: credentials,
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.type === 'success') {
        this.errorMessage = "";
        console.log("USUARIO LOGUEADO");
        document.cookie = `loged=${this.email}`
        this.redirectUser(this.email);
      } else {
        this.errorMessage = json.message;
        document.cookie = `loged=;`

        // Validar intentos de acceso
        let correoIntento = localStorage.getItem('correoIntento');
        let intentos = parseInt(localStorage.getItem('intentos') || '0');
        console.log(correoIntento);
        if (correoIntento !== "" && correoIntento === this.email && correoIntento !== 'admin') {
          intentos += 1;
          if (intentos >= 3) {
            console.log('cuenta bloqueada');
            localStorage.setItem('intentos', '0');
            localStorage.setItem('correoIntento', '');
            this.sendEmail(correoIntento);

          } else {
            localStorage.setItem('intentos', `${intentos}`);
            localStorage.setItem('correoIntento', this.email);
          }
        } else {
          localStorage.setItem('intentos', '1');
          localStorage.setItem('correoIntento', this.email);
        }

      }
    })
    .catch(error => {
      console.log("error", error)
    });
  }

  // Bloquear cuenta
  async sendEmail(email: string): Promise<any> {
    console.log("Bloquear al usuario", email);

    let userChangeStatus = await fetch('http://127.0.0.1:3030/users/bloquear', {
      method: "PATCH",
      body: JSON.stringify({email: email}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    let responseStatus = await userChangeStatus.json();

    if (responseStatus.type === 'success') {
      let emailSend = await fetch('http://fuboxapi.uaenorth.cloudapp.azure.com:3040/send-email', {
            method: "POST",
            body: JSON.stringify({
              "to": email,
              "subject": "Bloqueo de Cuenta",
              "text": "Se ha bloqueado la cuenta del usuario: " + email + " ingrese al sistema para desbloquearla",
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            });

      let sendStauts = await emailSend.json();
      if (sendStauts.type === 'success') {
        alert("Usuario Bloqueado");
      }
      console.log("Notificacion enviada", sendStauts);
    }

  }


}
