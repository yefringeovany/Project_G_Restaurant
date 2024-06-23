import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../categorias/categoria.service';
import { MenuService } from '../menus/menu.service';
import { PosService } from './pos.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})

export class PosComponent implements OnInit {
  categorias: any[] = [];
  menus: any[] = [];
  categoriaSeleccionadaId: number;
  menuSeleccionadoId: number;
  itemsAgregados: any[] = [];
  cantidad: number = 1;
  montoTotal: number = 0;
  pagado: number = 0;
  cambio: number = 0;
  estado: string;

  constructor(
    private categoriaService: CategoriaService,
    private menuService: MenuService,
    private posService: PosService
  ) { }

  ngOnInit(): void {
    this.categoriaService.listadoCategorias().subscribe(
      (response) => {
        this.categorias = response;
        if (this.categorias.length > 0) {
          this.categoriaSeleccionada(this.categorias[0].id);
        }
      },
      (error) => {
        console.error('Error al obtener el listado de categorias: ', error);
      }
    );
  }

  categoriaSeleccionada(idCategoria: number) {
    const convertirNumeroIdCategoria = Number(idCategoria);
    this.categoriaSeleccionadaId = convertirNumeroIdCategoria;
    this.menuService.listadoMenusPorCategoria(idCategoria).subscribe(
      (response) => {
        this.menus = response;
        if (this.menus.length > 0) {
          this.menuSeleccionadoId = this.menus[0].id;
        } else {
          this.menuSeleccionadoId = null;
        }
      },
      (error) => {
        console.error('Error al obtener el listado de menus: ', error);
      }
    );
  }

  menuSeleccionado(idMenu: number) {
    this.menuSeleccionadoId = idMenu;
  }

  agregarALaOrden() {
    console.log('INICIO LOG ORDEN');
    console.log('Agregar orden - ID categoria seleccionada:', this.categoriaSeleccionadaId);
    console.log('Agregar orden - ID menu seleccionado:', this.menuSeleccionadoId);
    console.log('Agregar orden - Menus cargados:', this.menus);
    if (!this.categoriaSeleccionadaId) {
      console.error('No se ha seleccionado una categoría válida.');
      return;
    }
    if (!this.menuSeleccionadoId) {
      console.error('No se ha seleccionado un menú válido.');
      return;
    }
    const categoriaSeleccionada = this.categorias.find(categoria => categoria.id === this.categoriaSeleccionadaId);
    const menuSeleccionado = this.menus.find(menu => menu.id === this.menuSeleccionadoId);
    console.log('Agregar orden - Categoria seleccionada:', categoriaSeleccionada);
    console.log('Agregar orden - Menu seleccionado:', menuSeleccionado);
    console.log('FIN LOG ORDEN');
    if (!categoriaSeleccionada || !menuSeleccionado) {
      console.error('No se ha seleccionado una categoría o menú válido.');
      return;
    }
    const cantidadIngresada = this.cantidad;
    const precioMenu = menuSeleccionado.precio;
    const montoItem = cantidadIngresada * precioMenu;
    this.itemsAgregados.push({
      categoria: categoriaSeleccionada.nombre,
      menu: menuSeleccionado.nombre,
      cantidad: cantidadIngresada,
      monto: montoItem,
      menu_id: menuSeleccionado.id
    });
    this.montoTotal = this.itemsAgregados.reduce((total, item) => total + item.monto, 0);
  }

  agregarItem() {
    this.agregarALaOrden();
  }

  calcularCambio() {
    if (this.pagado >= this.montoTotal) {
      this.cambio = this.pagado - this.montoTotal;
    } else {
      this.cambio = 0;
    }
  }

  crearOrden() {
    const menu_items = this.itemsAgregados.map(item => ({
      menu_id: item.menu_id,
      cantidad: item.cantidad
    }));
    this.posService.registroOrdenes(this.montoTotal, this.pagado, this.cambio, this.estado, menu_items).subscribe(
      (response) => {
        console.log('Orden registrada exitosamente:', response);
      },
      (error) => {
        console.error('Error al registrar la orden:', error);
      }
    );
  }
}
