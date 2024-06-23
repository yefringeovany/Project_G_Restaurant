import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoginService} from "./login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  correo_electronico: string;
  contrasenia: string;

  constructor(private authService: LoginService, private router: Router) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  login(correo_electronico: string, contrasenia: string) {
    this.authService.login(correo_electronico, contrasenia).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']).then(r => r.valueOf());
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
      }
    );
  }

}
