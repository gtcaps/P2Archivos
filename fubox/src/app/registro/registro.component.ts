import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  users:any;
  name:string;
  lastname:string;
  email:string;
  password:string;
  telephone:string;
  bornDate:string;
  errorMessage:string;
  successMessage:string;


  constructor(private route:Router) {
    this.name = "";
    this.lastname = "";
    this.email = "";
    this.password = "";
    this.telephone = "";
    this.bornDate = "";
    this.errorMessage = "";
    this.successMessage = "";
  }

  ngOnInit(): void {
    let userLoged = this.getUserLoged();
    console.log(`->${userLoged}<-`);
    this.redirectUser(userLoged);
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


  cleanFields(): void {
    this.name = "";
    this.lastname = "";
    this.email = "";
    this.password = "";
    this.telephone = "";
    this.bornDate = "";
    this.errorMessage = "";
  }

  registerUser(): void {
    //llamadaAsync();

    if (this.validateFormFields()) {
      let newUser = {
        "name": this.name,
        "lastname": this.lastname,
        "email": this.email,
        "password": this.password,
        "telephone": this.telephone,
        "bornDate": this.bornDate,
        "active": false,
        "registerDate": new Date()
      }

      // Registrar el usuario
      let llamadaAsync = async () => {
        try {
          let registerUser = await fetch('http://127.0.0.1:3030/users', {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {"Content-type": "application/json; charset=UTF-8"}
          });

          let registerResponse = await registerUser.json();

          if (registerResponse.message.toLowerCase() === 'usuario almacenado') {
            this.errorMessage = "";
            this.successMessage = registerResponse.message;

            console.log("ENVIAR CORREO");

            let sendEmail = await fetch('http://fuboxapi.uaenorth.cloudapp.azure.com:3040/send-email', {
            method: "POST",
            body: JSON.stringify({
              "to": newUser.email,
              "subject": "Registro",
              "text": `${newUser.registerDate}<br>Se ha registrado, espere la confirmacion del admin para acceder`,
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            });

            let sendStauts = await sendEmail.json();

            this.cleanFields();
            console.log(sendStauts);

          } else {
            this.errorMessage = registerResponse.message;
            this.successMessage = "";
          }

        } catch (error) {
          this.errorMessage = "No fue posible registrar al usuario";
          this.successMessage = "";
          console.log(error);
        }
      };

      llamadaAsync();
    }
  }

  validateFormFields(): boolean {
    if (this.name.trim() === "" || this.lastname.trim() === "" ||
        this.email.trim() === "" || this.password.trim() === "" ||
        this.telephone === ""|| this.bornDate.trim() === "") {
      this.errorMessage = "Complete todos los datos!!!"
      return false;
    }

    // Validar el correo electronico
    let re = /\S+@\S+\.\S+/;
    if (!re.test(this.email.trim())) {
      this.errorMessage = "Correo Electronico Invalido"
      return false;
    }

    // Validar el telefono
    re = new RegExp('^\d+$  ');
    if (!re.test(this.telephone.trim()) && this.telephone.toString().length !== 8) {
      this.errorMessage = "El telefono debe ser numerico y de 8 digitos";
      return false;
    }

    // Validar contraseña
    re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!re.test(this.password.trim())) {
      this.errorMessage = "Contraseña Invalida: Mínimo 8 caracteres, al menos una letra mayúscula, números y simbolos";
      return false;
    }

    // Validar Fecha
    if (this.bornDate.trim().includes('dma')) {
      this.errorMessage = "Seleccione una fecha valida";
      return false;
    }

    this.errorMessage = "";
    return true;
  }

}
