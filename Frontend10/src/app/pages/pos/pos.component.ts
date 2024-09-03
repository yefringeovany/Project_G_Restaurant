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
  estado: string = 'PENDIENTE';
  ordenCreada: boolean = false; // Propiedad para rastrear si la orden fue creada exitosamente

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

      this.categoriaSeleccionadaId = Number(idCategoria);
      this.menuService.listadoMenusPorCategoria(this.categoriaSeleccionadaId).subscribe(
      (response) => {
      this.menus = response;
      this.menuSeleccionadoId = null;  // Resetear el menú seleccionado
      if (this.menus.length > 0) {
        this.menuSeleccionadoId = this.menus[0].id;  // Asignar el primer menú por defecto
      }
      },
      ( error) => {
      console.error('Error al obtener el listado de menús: ', error);
      }
      );
      }

  // menuSeleccionado(idMenu: number) {
  //   this.menuSeleccionadoId = idMenu;
  // }

  agregarALaOrden() {
    if (!this.categoriaSeleccionadaId || !this.menuSeleccionadoId) {
      console.error('No se ha seleccionado una categoría o menú válido.');
      return;
    }

    const categoriaSeleccionada = this.categorias.find(categoria => categoria.id === this.categoriaSeleccionadaId);
    const menuSeleccionado = this.menus.find(menu => menu.id === this.menuSeleccionadoId);

    if (!categoriaSeleccionada || !menuSeleccionado) {
      console.error('No se ha encontrado la categoría o menú en la lista.');
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

     // Resetear valores para la próxima selección
    this.menuSeleccionadoId = null;
    this.cantidad = 1;
  }
  menuSeleccionado(idMenu: number) {
    this.menuSeleccionadoId = Number(idMenu);  // Asegurar que el ID es un número
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

    // aqui agregue esto
    if (this.itemsAgregados.length === 0) {
      console.error('No se han agregado ítems a la orden.');
      return;
    }

    const menu_items = this.itemsAgregados.map(item => ({
      menu_id: item.menu_id,
      cantidad: item.cantidad
    }));

    // El estado se establece automáticamente como 'PENDIENTE'
    this.posService.registroOrdenes(this.montoTotal, this.pagado, this.cambio, this.estado, menu_items).subscribe(
      (response) => {
        console.log('Orden registrada exitosamente:', response);

      // Mostrar mensaje de éxito
      this.ordenCreada = true;

       // Limpiar el estado después de registrar la orden
      this.itemsAgregados = [];
      this.montoTotal = 0;
      this.pagado = 0;
      this.cambio = 0;
      // this.estado = '';
      this.menuSeleccionadoId = null;
      this.categoriaSeleccionadaId = null;

      // Reiniciar el estado a 'PENDIENTE' para la siguiente orden
      this.estado = 'PENDIENTE';
    },
      (error) => {
        console.error('Error al registrar la orden:', error);
      }
    );
  }
}
