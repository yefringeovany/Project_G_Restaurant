import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_BASE_URL } from "../../../api.config";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) {
  }

  registroCategorias(nombre: string, descripcion: string, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.post(`${API_BASE_URL}/categoria/register`, {
      nombre,
      descripcion,
      estado
    }, {
      headers
    });
  }

  actualizarCategoria(id: number, nombre: string, descripcion: string, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.put(`${API_BASE_URL}/categoria/update/${id}`, {
      nombre,
      descripcion,
      estado
    }, {
      headers
    });
  }

  eliminarCategoria(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.delete(`${API_BASE_URL}/categoria/delete/${id}`, {
      headers
    });
  }

  listadoCategorias(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(`${API_BASE_URL}/categoria/list`, {
      headers
    });
  }
}
