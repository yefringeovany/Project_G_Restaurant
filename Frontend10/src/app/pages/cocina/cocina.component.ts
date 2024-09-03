import { Component, OnInit } from '@angular/core';
import { CocinaService } from './cocina.service';
import { OrdenService } from '../ordenes/orden.service';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.scss']
})
export class CocinaComponent implements OnInit {
  ordenesPendientes: any[] = [];

  constructor(
    private cocinaService: CocinaService,
    private ordenService: OrdenService
  ) { }

  ngOnInit(): void {
    this.listadoOrdenesPendientes();
  }

  listadoOrdenesPendientes() {
    this.cocinaService.listadoOrdenesPendientes().subscribe(
      (response) => {
        this.ordenesPendientes = response;
      },
      (error) => {
        console.error('Error al obtener la lista de órdenes pendientes:', error);
      }
    );
  }

  entregarOrden(id: number) {
    const idNumero = Number(id);
    this.ordenService.actualizarOrden(idNumero, 'TERMINADO').subscribe(
      () => {
        this.listadoOrdenesPendientes();
      },
      (error) => {
        console.error('Error al entregar la orden:', error);
      }
    );
  }
}
