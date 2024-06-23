import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_BASE_URL} from "../../../api.config";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) {
  }

  registroUsuarios(nombre: string, apellido: string, correo_electronico: string, contrasenia: string, rol: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/user/register`, {
      nombre,
      apellido,
      correo_electronico,
      contrasenia,
      rol
    });
  }

  actualizarUsuario(id: number, nombre: string, apellido: string, correo_electronico: string, contrasenia: string, rol: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.put(`${API_BASE_URL}/user/update/${id}`, {
      nombre,
      apellido,
      correo_electronico,
      contrasenia,
      rol
    }, {
      headers
    });
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.delete(`${API_BASE_URL}/user/delete/${id}`, {
      headers
    });
  }

  listadoUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(`${API_BASE_URL}/user/list`, {
      headers
    });
  }
}
