import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre: string = '';
  apellido: string = '';
  correo_electronico: string = '';
  contrasenia: string = '';
  rol: string = '';
  usuarioCreado: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  registroUsuarios() {
    if (!this.nombre || !this.apellido || !this.correo_electronico || !this.contrasenia || !this.rol) {
      this.error = 'Por favor, llena todos los campos.';
      return;
    }

    const usuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo_electronico: this.correo_electronico,
      contrasenia: this.contrasenia,
      rol: this.rol
    };

    const url = 'http://localhost:5000/user/register';

    this.http.post(url, usuario).subscribe(
      response => {
        console.log('Usuario creado con éxito:', response);
        this.usuarioCreado = true; // Muestra el mensaje de éxito
        this.error = null;

        // Espera 2 segundos antes de redirigir al login
        setTimeout(() => {
          this.router.navigate(['/pages/login']);
        }, 2000);
      },
      error => {
        console.error('Error al crear el usuario:', error);
        this.error = 'Error al crear el usuario. Inténtalo nuevamente.';
      }
    );
  }
}
