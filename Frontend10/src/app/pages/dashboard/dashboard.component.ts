// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../ordenes/orden.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ordenesTerminadas: any[] = [];
  totalOrdenesHoy: number = 0;


  constructor(private ordenService: OrdenService) { }

  ngOnInit() {
    this.listadoOrdenesTerminadas();
    this.obtenerTotalOrdenesEntregadasHoy();
  }

  listadoOrdenesTerminadas() {
    this.ordenService.listadoOrdenesTerminadas().subscribe(
      (response) => {
        this.ordenesTerminadas = response;
      },
      (error) => {
        console.error('Error al obtener la lista de órdenes terminadas:', error);
      }
    );
  }

  entregarOrden(ordenId: number) {
    this.ordenService.entregarOrden(ordenId).subscribe(
      (response) => {
        console.log('Orden entregada con éxito:', response);
        // Remover la orden de la lista después de entregarla
        this.ordenesTerminadas = this.ordenesTerminadas.filter(orden => orden.id !== ordenId);
        this.obtenerTotalOrdenesEntregadasHoy();  // Actualizar el contador después de entregar una orden
      },
      (error) => {
        console.error('Error al entregar la orden:', error);
      }
    );
  }
  obtenerTotalOrdenesEntregadasHoy() {
    this.ordenService.obtenerTotalOrdenesEntregadasHoy().subscribe(
      (response) => {
        this.totalOrdenesHoy = response.totalordeneshoy;
      },
      (error) => {
        console.error('Error al obtener el total de órdenes entregadas hoy:', error);
      }
    );
  }

}
