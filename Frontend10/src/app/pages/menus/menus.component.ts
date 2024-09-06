import { Component, OnInit } from '@angular/core';
import { MenuService } from "./menu.service";
import { CategoriaService } from "../categorias/categoria.service";

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
  imagen: File | null = null; // Campo para la imagen
  menuCreado: boolean = false;
  menuActualizado: boolean = false;
  menus: any[] = [];
  categorias: any[] = [];
  formularioMenu: boolean = false;
  botonCrearNuevoMenu: boolean = true;
  tablaMenus: boolean = true;
  idMenuEditar: number | null = null;

  constructor(private menuService: MenuService, private categoriaService: CategoriaService) {
  }

  ngOnInit(): void {
    this.listadoMenus();
    this.listadoCategorias();
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imagen = event.target.files[0];
    }
  }

  registroMenus(categoria_id: number, nombre: string, descripcion: string, precio: number, estado: string) {
    if (this.idMenuEditar !== null) {
      this.actualizarMenu(this.idMenuEditar, categoria_id, nombre, descripcion, precio, estado);
      this.limpiarCampos();
      this.ocultarAlerta();
    } else {
      this.menuService.registroMenus(categoria_id, nombre, descripcion, precio, estado, this.imagen).subscribe(
        () => {
          this.menuCreado = true;
          this.formularioMenu = true;
          this.botonCrearNuevoMenu = false;
          this.tablaMenus = false;
          this.limpiarCampos();
          this.ocultarAlerta();
        },
        (error) => {
          console.error('Error en el registro del nuevo menu:', error);
        }
      );
    }
  }

  actualizarMenu(id: number, categoria_id: number, nombre: string, descripcion: string, precio: number, estado: string) {
    this.menuService.actualizarMenu(id, categoria_id, nombre, descripcion, precio, estado).subscribe(
      () => {
        this.menuActualizado = true;
        this.listadoMenus();
      },
      (error) => {
        console.error('Error al actualizar el menu:', error);
      }
    );
  }

  eliminarMenu(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este menu?')) {
      this.menuService.eliminarMenu(id).subscribe(
        () => {
          this.listadoMenus();
        },
        (error) => {
          console.error('Error al eliminar el menu:', error);
        }
      );
    }
  }

  listadoMenus() {
    this.menuService.listadoMenus().subscribe(
      (response) => {
        this.menus = response;
      },
      (error) => {
        console.error('Error al obtener la lista de menus:', error);
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

  editarMenu(menu: any) {
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

  obtenerNombreCategoria(categoria_id: number): string {
    if (categoria_id != null) {
      const categoria = this.categorias.find(c => c.id == categoria_id);
      return categoria ? categoria.nombre : '';
    } else {
      return '';
    }
  }

  cancelarEdicion() {
    this.idMenuEditar = null;
    this.limpiarCampos();
    this.formularioMenu = false;
    this.botonCrearNuevoMenu = true;
    this.tablaMenus = true;
  }

  limpiarCampos() {
    this.categoria_id = null;
    this.nombre = '';
    this.descripcion = '';
    this.precio = null;
    this.estado = '';
    this.imagen = null; // Limpiar la imagen seleccionada
  }

  ocultarAlerta() {
    setTimeout(() => {
      this.menuCreado = false;
      this.menuActualizado = false;
      this.formularioMenu = false;
      this.botonCrearNuevoMenu = true;
      this.tablaMenus = true;
      this.listadoMenus();
    }, 5000);
  }
}
