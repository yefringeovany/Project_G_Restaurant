import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_BASE_URL } from "../../../api.config";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) {
  }

  registroMenus(categoria_id: number, nombre: string, descripcion: string, precio: number, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.post(`${API_BASE_URL}/menu/register`, {
      categoria_id,
      nombre,
      descripcion,
      precio,
      estado
    }, {
      headers
    });
  }

  actualizarMenu(id: number, categoria_id: number, nombre: string, descripcion: string, precio: number, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.put(`${API_BASE_URL}/menu/update/${id}`, {
      categoria_id,
      nombre,
      descripcion,
      precio,
      estado
    }, {
      headers
    });
  }

  eliminarMenu(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.delete(`${API_BASE_URL}/menu/delete/${id}`, {
      headers
    });
  }

  listadoMenus(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(`${API_BASE_URL}/menu/list`, {
      headers
    });
  }

  listadoMenusPorCategoria(categoriId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(`${API_BASE_URL}/menu/categoria/${categoriId}`, {
      headers
    });
  }
}
