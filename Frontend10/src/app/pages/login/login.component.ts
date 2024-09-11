import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  correo_electronico: string;
  contrasenia: string;

  constructor(private authService: LoginService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() { }

  ngOnDestroy() { }
  login() {
    // Validar si los campos están vacíos
    if (!this.correo_electronico || !this.contrasenia) {
      this.snackBar.open('Todos los campos son obligatorios', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['alerta-error'] // Puedes agregar clases personalizadas para el estilo
      });
      return;
    }

    // Llamada al servicio de autenticación
    this.authService.login(this.correo_electronico, this.contrasenia).subscribe(
      (response) => {
        if (response.auth) {
          // Credenciales correctas
          localStorage.setItem('token', response.token);
          this.snackBar.open('Bienvenido al sistema de Luna Café', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['alerta-exito'] // Clases personalizadas para estilos
          });
          this.router.navigate(['/dashboard']);
        } else {
          // Credenciales incorrectas
          this.snackBar.open('Credenciales inválidas, vuelva a ingresar sus credenciales!', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['alerta-error']
          });
        }
      },
      (error) => {
        // Error en la comunicación con el servidor
        console.error('Error en el inicio de sesión:', error);
        this.snackBar.open('Ocurrió un error en el inicio de sesión', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['alerta-error']
        });
      }
    );
  }

}
