import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// Angular Material Components
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTreeModule} from '@angular/material/tree';


// Vistas
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PruebaComponent } from './prueba/prueba.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { PageAccessDeniedComponent } from './page-access-denied/page-access-denied.component';
import { AdminBajaComponent } from './admin-baja/admin-baja.component';
import { AdminCarpetaComponent } from './admin-carpeta/admin-carpeta.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { AdminAltaComponent } from './admin-alta/admin-alta.component';
import { UserUpdateComponent } from './user-update/user-update.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PruebaComponent,
    HomeComponent,
    RegistroComponent,
    LoginComponent,
    AdminComponent,
    UserComponent,
    PageAccessDeniedComponent,
    AdminBajaComponent,
    AdminCarpetaComponent,
    AdminMenuComponent,
    AdminAltaComponent,
    UserUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
