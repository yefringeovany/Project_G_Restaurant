import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_BASE_URL } from "../../../api.config";

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(private http: HttpClient) {
  }

  actualizarOrden(id: number, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.put(`${API_BASE_URL}/orden/update/${id}`, {
      estado
    }, {
      headers
    });
  }

  eliminarOrden(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.delete(`${API_BASE_URL}/orden/delete/${id}`, {
      headers
    });
  }

 // Método para obtener solo las órdenes con estado "TERMINADO"
 listadoOrdenesTerminadas(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': token
  });
  return this.http.get(`${API_BASE_URL}/orden/list/finish`, {
    headers
  });
}

  obtenerTotalOrdenesEntregadasHoy(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(`${API_BASE_URL}/orden/entregadas-hoy`, {
      headers
    });
  }

 // Método para entregar una orden
 entregarOrden(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': token
  });
  return this.http.post(`${API_BASE_URL}/orden/entregar/${id}`, {}, {
    headers
  });
  }

  listadoOrdenes(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(`${API_BASE_URL}/orden/list`, {
      headers
    });
  }
}
