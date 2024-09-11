import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles: string[];
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'ni ni-tv-2 text-primary',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR', 'CHEF', 'MESERO']
  },
  {
    path: '/pos',
    title: 'POS',
    icon: 'ni ni-cart text-blue',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR', 'MESERO']
  },
  {
    path: '/ordenes',
    title: 'Ordenes',
    icon: 'ni ni-bullet-list-67 text-orange',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR', 'MESERO']
  },
  {
    path: '/cocina',
    title: 'Cocina',
    icon: 'ni ni-single-02 text-yellow',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR', 'CHEF']
  },
  {
    path: '/categorias',
    title: 'Categorias',
    icon: 'ni ni-bullet-list-67 text-red',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR']
  },
  {
    path: '/menu',
    title: 'Menu',
    icon: 'ni ni-shop text-info',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR']
  },
  // {
  //   path: '/reportes',
  //   title: 'Reportes',
  //   icon: 'ni ni-chart-bar-32 text-pink',
  //   class: '',
  //   roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR']
  // },
  {
    path: '/usuarios',
    title: 'Usuarios',
    icon: 'ni ni-circle-08 text-info',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR']
  },
  {
    path: '/informacion',
    title: 'Informacion',
    icon: 'ni ni-settings text-pink',
    class: '',
    roles: ['SUPER_ADMINISTRADOR', 'ADMINISTRADOR']
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  public userRole: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.userRole = this.obtenerRolDelUsuario();
    this.filtarMenuItems();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  obtenerRolDelUsuario(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return tokenPayload.rol;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
    return '';
  }

  filtarMenuItems(): void {
    this.menuItems = ROUTES.filter(menuItem => {
      return menuItem.roles.includes(this.userRole);
    });
  }
}
