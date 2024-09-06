import { Component, OnInit } from '@angular/core';
import { MenuService } from "./menu.service";
import { CategoriaService } from "../categorias/categoria.service";

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  categoria_id: number | null = null;
  nombre: string = '';
  descripcion: string = '';
  precio: number | null = null;
  estado: string = '';
  imagen: File | null = null;
  menuCreado: boolean = false;
  menuActualizado: boolean = false;
  menus: any[] = [];
  categorias: any[] = [];
  formularioMenu: boolean = false;
  botonCrearNuevoMenu: boolean = true;
  tablaMenus: boolean = true;
  idMenuEditar: number | null = null;

  constructor(private menuService: MenuService, private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.listadoMenus();
    this.listadoCategorias();
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imagen = event.target.files[0];
    }
  }

  registroMenus(): void {
    if (this.idMenuEditar !== null) {
      this.actualizarMenu(this.idMenuEditar, this.categoria_id, this.nombre, this.descripcion, this.precio, this.estado);
    } else {
      this.menuService.registroMenus(this.categoria_id, this.nombre, this.descripcion, this.precio, this.estado, this.imagen).subscribe(
        () => {
          this.menuCreado = true;
          this.ocultarAlerta();
        },
        (error) => {
          console.error('Error en el registro del nuevo menú:', error);
        }
      );
    }
  }

  actualizarMenu(id: number, categoria_id: number | null, nombre: string, descripcion: string, precio: number | null, estado: string): void {
    this.menuService.actualizarMenu(id, categoria_id, nombre, descripcion, precio, estado).subscribe(
      () => {
        this.menuActualizado = true;
        this.listadoMenus();
        this.cancelarEdicion();
      },
      (error) => {
        console.error('Error al actualizar el menú:', error);
      }
    );
  }

  eliminarMenu(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este menú?')) {
      this.menuService.eliminarMenu(id).subscribe(
        () => {
          this.listadoMenus();
        },
        (error) => {
          console.error('Error al eliminar el menú:', error);
        }
      );
    }
  }

  listadoMenus(): void {
    this.menuService.listadoMenus().subscribe(
      (response) => {
        this.menus = response;
      },
      (error) => {
        console.error('Error al obtener la lista de menús:', error);
      }
    );
  }

  listadoCategorias(): void {
    this.categoriaService.listadoCategorias().subscribe(
      (response) => {
        this.categorias = response;
      },
      (error) => {
        console.error('Error al obtener la lista de categorías:', error);
      }
    );
  }

  editarMenu(menu: any): void {
    this.idMenuEditar = menu.id;
    this.categoria_id = menu.categoria_id;
    this.nombre = menu.nombre;
    this.descripcion = menu.descripcion;
    this.precio = menu.precio;
    this.estado = menu.estado;
    this.formularioMenu = true;
    this.botonCrearNuevoMenu = false;
    this.tablaMenus = false;
  }

  obtenerNombreCategoria(categoria_id: number | null): string {
    const categoria = this.categorias.find(c => c.id === categoria_id);
    return categoria ? categoria.nombre : '';
  }

  cancelarEdicion(): void {
    this.idMenuEditar = null;
    this.limpiarCampos();
    this.formularioMenu = false;
    this.botonCrearNuevoMenu = true;
    this.tablaMenus = true;
  }

  limpiarCampos(): void {
    this.categoria_id = null;
    this.nombre = '';
    this.descripcion = '';
    this.precio = null;
    this.estado = '';
    this.imagen = null;
  }

  ocultarAlerta(): void {
    setTimeout(() => {
      this.menuCreado = false;
      this.menuActualizado = false;
      this.listadoMenus();
    }, 5000);
  }
}
