import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  userLoged:string;
  errorMessage:string;
  successMessage:string;
  userData: any;
  habilitarModificar: boolean;

  constructor(private route:Router) {
    this.userLoged = "";
    this.errorMessage = "";
    this.successMessage = "";
    this.habilitarModificar = false;
  }

  ngOnInit(): void {
    this.userLoged = this.getUserLoged();
    console.log(`->${this.userLoged}<-`);
    this.redirectUser(this.userLoged);

    // Obtener data
    fetch('http://127.0.0.1:3030/users')
    .then(response => response.json())
    .then(response => {
      this.userData = response.find((user: any) => user.email === this.userLoged);
      console.log(this.userData);
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
    if (user === '' || user === 'admin') {
      this.route.navigate(['/access-denied']);
    }
  }

  closeSession(): void {
    document.cookie = "loged=;"
  }

  modificarUsuario(): void {
    //llamadaAsync();

    if (this.validateFormFields()) {
      console.log("modificar")

      // Registrar el usuario
      let llamadaAsync = async () => {
        try {
          let registerUser = await fetch('http://127.0.0.1:3030/users/modify', {
            method: "PUT",
            body: JSON.stringify(this.userData),
            headers: {"Content-type": "application/json; charset=UTF-8"}
          });

          let registerResponse = await registerUser.json();

          if (registerResponse.type === 'success') {
            this.errorMessage = "";
            this.successMessage = registerResponse.message;

            console.log("ENVIAR CORREO");

            let sendEmail = await fetch('http://fuboxapi.uaenorth.cloudapp.azure.com:3040/send-email', {
            method: "POST",
            body: JSON.stringify({
              "to": this.userData.email,
              "subject": "Modificacion",
              "text": `Se ha modificado los datos de su cuenta`,
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            });

            let sendStauts = await sendEmail.json();
            if (sendStauts.type === 'success') {
              alert("Se ha actualizado el estado de la cuenta");
              window.location.reload();
            }

          } else {
            this.errorMessage = registerResponse.message;
            this.successMessage = "";
          }

        } catch (error) {
          this.errorMessage = "No fue posible modificar al usuario";
          this.successMessage = "";
          console.log(error);
        }
      };

      llamadaAsync();
    }
  }

  validateFormFields(): boolean {
    if (this.userData.name.trim() === "" || this.userData.lastname.trim() === "" ||
        this.userData.email.trim() === "" || this.userData.password.trim() === "" ||
        this.userData.telephone === ""|| this.userData.bornDate.trim() === "") {
      this.errorMessage = "Complete todos los datos!!!"
      return false;
    }

    // Validar el correo electronico
    let re = /\S+@\S+\.\S+/;
    if (!re.test(this.userData.email.trim())) {
      this.errorMessage = "Correo Electronico Invalido"
      return false;
    }

    // Validar el telefono
    re = new RegExp('^\d+$  ');
    if (!re.test(this.userData.telephone.trim()) && this.userData.telephone.toString().length !== 8) {
      this.errorMessage = "El telefono debe ser numerico y de 8 digitos";
      return false;
    }

    // Validar contraseña
    re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!re.test(this.userData.password.trim())) {
      this.errorMessage = "Contraseña Invalida: Mínimo 8 caracteres, al menos una letra mayúscula, números y simbolos";
      return false;
    }

    // Validar Fecha
    if (this.userData.bornDate.trim().includes('dma')) {
      this.errorMessage = "Seleccione una fecha valida";
      return false;
    }

    this.errorMessage = "";
    return true;
  }

}


