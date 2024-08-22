import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  correo_electronico: string;
  contrasenia: string;

  constructor(private authService: LoginService, private router: Router) { }

  ngOnInit() { }

  ngOnDestroy() { }
  login() {
    this.authService.login(this.correo_electronico, this.contrasenia).subscribe(
      (response) => {
        if (response.auth) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Error en el inicio de sesión:', response.error);
          // Mostrar mensaje de error al usuario
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        // Mostrar mensaje de error al usuario
      }
    );
  }

}
