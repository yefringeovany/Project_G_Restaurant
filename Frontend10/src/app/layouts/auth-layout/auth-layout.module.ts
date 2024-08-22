import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthLayoutRoutes } from './auth-layout.routing';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../components/register/register.component'; // Importa tu componente

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,  // Declara tu componente aquí
  ]
})
export class AuthLayoutModule { }
