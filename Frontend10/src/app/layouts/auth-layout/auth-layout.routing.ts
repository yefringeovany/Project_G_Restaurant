import {Routes} from '@angular/router';

import {LoginComponent} from '../../pages/login/login.component';
import { RegisterComponent } from '../../components/register/register.component'; // Importa tu componente

export const AuthLayoutRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent}
];
