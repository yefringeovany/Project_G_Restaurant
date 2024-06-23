import { Component, OnInit } from '@angular/core';
import { MenuService } from "../menus/menu.service";
import { CategoriaService } from "../categorias/categoria.service";
import { OrdenService } from "./orden.service";

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  monto_total: number;
  pagado: number;
  cambio: number;
  estado: string;
  menu_items: string;
  categoria_id: number;
  menu_id: number;
  menusFiltrados: any[] = [];
  categorias: any[];
  menus: any[];
  ordenCreada: boolean = false;
  ordenActualizada: boolean = false;
  ordenes: any[];
  formularioOrdenes: boolean = false;
  botonCrearNuevaOrden: boolean = true;
  tablaOrdenes: boolean = true;
  idOrdenEditar: number | null = null;

  constructor(private ordenService: OrdenService, private menuService: MenuService, private categoriaService: CategoriaService) {
  }

  ngOnInit(): void {
    this.listadoOrdenes();
    this.listadoCategorias();
    this.listadoMenus();
  }

  eliminarOrden(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este menu?')) {
      this.ordenService.eliminarOrden(id).subscribe(
        () => {
          this.listadoOrdenes();
        },
        (error) => {
          console.error('Error al eliminar el menu:', error);
        }
      );
    }
  }

  listadoOrdenes() {
    this.ordenService.listadoOrdenes().subscribe(
      (response) => {
        this.ordenes = response;
      },
      (error) => {
        console.error('Error al obtener la lista de órdenes:', error);
      }
    );
  }

  listadoCategorias() {
    this.categoriaService.listadoCategorias().subscribe(
      (response) => {
        this.categorias = response;
      },
      (error) => {
        console.error('Error al obtener la lista de categorías:', error);
      }
    );
  }

  listadoMenus() {
    this.menuService.listadoMenus().subscribe(
      (response) => {
        this.menus = response;
      },
      (error) => {
        console.error('Error al obtener la lista de menús:', error);
      }
    );
  }
}
