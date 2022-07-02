import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAltaComponent } from './admin-alta/admin-alta.component';
import { AdminBajaComponent } from './admin-baja/admin-baja.component';
import { AdminCarpetaComponent } from './admin-carpeta/admin-carpeta.component';
import { AdminComponent } from './admin/admin.component';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageAccessDeniedComponent } from './page-access-denied/page-access-denied.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PruebaComponent } from './prueba/prueba.component';
import { RegistroComponent } from './registro/registro.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'bajaUsuarios', component: AdminBajaComponent },
  { path: 'altaUsuarios', component: AdminAltaComponent },
  { path: 'carpetas', component: AdminCarpetaComponent },
  { path: 'user', component: UserComponent },
  { path: 'userUpdate', component: UserUpdateComponent },
  { path: 'access-denied', component: PageAccessDeniedComponent },
  { component: PageNotFoundComponent, path: '**'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
