import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // Si usas iconos
import { MatButtonModule } from '@angular/material/button'; // Si usas botones
import { MatListModule } from '@angular/material/list'; // Si usas listas


import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { InformacionComponent } from './pages/informacion/informacion.component'; // Ajusta la ruta según la ubicación del componente

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { NgOptimizedImage } from "@angular/common";
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { MenusComponent } from './pages/menus/menus.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';
import { PosComponent } from './pages/pos/pos.component';
import { CocinaComponent } from './pages/cocina/cocina.component';
// import { ReportesComponent } from './pages/reportes/reportes.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    NgOptimizedImage,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    UsuariosComponent,
    CategoriasComponent,
    MenusComponent,
    OrdenesComponent,
    PosComponent,
    CocinaComponent,
    InformacionComponent,
    // ReportesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
