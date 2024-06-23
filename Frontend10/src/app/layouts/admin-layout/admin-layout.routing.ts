import {Routes} from '@angular/router';

import {DashboardComponent} from '../../pages/dashboard/dashboard.component';
import {UsuariosComponent} from "../../pages/usuarios/usuarios.component";
import {CategoriasComponent} from "../../pages/categorias/categorias.component";
import {MenusComponent} from "../../pages/menus/menus.component";
import {OrdenesComponent} from "../../pages/ordenes/ordenes.component";
import {PosComponent} from "../../pages/pos/pos.component";
import {CocinaComponent} from "../../pages/cocina/cocina.component";
import {InformacionComponent} from "../../pages/informacion/informacion.component";
import {ReportesComponent} from "../../pages/reportes/reportes.component";

export const AdminLayoutRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'pos', component: PosComponent},
  {path: 'ordenes', component: OrdenesComponent},
  {path: 'cocina', component: CocinaComponent},
  {path: 'categorias', component: CategoriasComponent},
  {path: 'menu', component: MenusComponent},
  {path: 'reportes', component: ReportesComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'informacion', component: InformacionComponent}
];
