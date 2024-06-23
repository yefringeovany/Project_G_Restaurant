import {Component, OnInit} from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public listTitles: any[];
  public location: Location;
  public nombreCompleto: string;

  constructor(location: Location) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.obtenerNombreCompletoUsuario();
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  obtenerNombreCompletoUsuario() {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      let decoder = new TextDecoder('utf-8');
      const nombreDecodificado = decoder.decode(new Uint8Array(tokenPayload.nombre.split('').map((c: string) => c.charCodeAt(0))));
      const apellidoDecodificado = decoder.decode(new Uint8Array(tokenPayload.apellido.split('').map((c: string) => c.charCodeAt(0))));
      this.nombreCompleto = `${nombreDecodificado} ${apellidoDecodificado}`;
    }
  }
}
