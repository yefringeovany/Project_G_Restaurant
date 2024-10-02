import { Component, OnInit } from '@angular/core';
import { CocinaService } from './cocina.service';
import { OrdenService } from '../ordenes/orden.service';
import { API_BASE_URL } from 'src/api.config'; // Asegúrate de importar la URL base de la API
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.scss']
})
export class CocinaComponent implements OnInit {
  ordenesPendientes: any[] = [];

  constructor(
    private cocinaService: CocinaService,
    private ordenService: OrdenService,
    private snackBar: MatSnackBar
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
        this.showSuccessMessage('Orden entregada con éxito'); // Mostrar notificación de éxito
      },
      (error) => {
        console.error('Error al entregar la orden:', error);
        this.showErrorMessage('Error al entregar la orden'); // Mostrar notificación de error
      }
    );
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  getImageUrl(imageUrl: string): string {
    return imageUrl; // Devuelve la URL completa desde Cloudinary
  }
}
