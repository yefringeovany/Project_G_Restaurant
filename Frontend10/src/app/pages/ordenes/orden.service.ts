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
