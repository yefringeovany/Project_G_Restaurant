import {Component, OnInit} from '@angular/core';
import {CategoriaService} from "./categoria.service";

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  nombre: string;
  descripcion: string;
  estado: string;
  categoriaCreada: boolean = false;
  categoriaActualizada: boolean = false;
  categorias: any[];
  formularioCategoria: boolean = false;
  botonCrearNuevaCategoria: boolean = true;
  tablaCategorias: boolean = true;
  idCategoriaEditar: number | null = null;

  constructor(private categoriaService: CategoriaService) {
  }

  ngOnInit(): void {
    this.listadoCategorias();
  }

  registroCategorias(nombre: string, descripcion: string, estado: string) {
    if (this.idCategoriaEditar !== null) {
      this.actualizarCategoria(this.idCategoriaEditar, nombre, descripcion, estado);
      this.limpiarCampos();
      this.ocultarAlerta();
    } else {
      this.categoriaService.registroCategorias(nombre, descripcion, estado).subscribe(
        () => {
          this.categoriaCreada = true;
          this.formularioCategoria = true;
          this.botonCrearNuevaCategoria = false;
          this.tablaCategorias = false;
          this.limpiarCampos();
          this.ocultarAlerta();
        },
        (error) => {
          console.error('Error en el registro de la categoría:', error);
        }
      );
    }
  }

  actualizarCategoria(id: number, nombre: string, descripcion: string, estado: string) {
    this.categoriaService.actualizarCategoria(id, nombre, descripcion, estado).subscribe(
      () => {
        this.categoriaActualizada = true;
        this.listadoCategorias();
      },
      (error) => {
        console.error('Error al actualizar la categoría:', error);
      }
    );
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe(
        () => {
          this.listadoCategorias();
        },
        (error) => {
          console.error('Error al eliminar la categoría:', error);
        }
      );
    }
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

  limpiarCampos() {
    this.nombre = '';
    this.descripcion = '';
    this.estado = '';
  }

  ocultarAlerta() {
    setTimeout(() => {
      this.categoriaCreada = false;
      this.categoriaActualizada = false;
      this.formularioCategoria = false;
      this.botonCrearNuevaCategoria = true;
      this.tablaCategorias = true;
      this.listadoCategorias();
    }, 5000);
  }

  editarCategoria(categoria: any) {
    this.idCategoriaEditar = categoria.id;
    this.nombre = categoria.nombre;
    this.descripcion = categoria.descripcion;
    this.estado = categoria.estado;
    this.formularioCategoria = true;
    this.botonCrearNuevaCategoria = false;
    this.tablaCategorias = false;
  }

  cancelarEdicion() {
    this.idCategoriaEditar = null;
    this.limpiarCampos();
    this.formularioCategoria = false;
    this.botonCrearNuevaCategoria = true;
    this.tablaCategorias = true;
  }
}
