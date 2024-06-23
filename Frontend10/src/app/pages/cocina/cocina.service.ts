import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from 'src/api.config';

@Injectable({
  providedIn: 'root'
})

export class CocinaService {

  constructor(private http: HttpClient) { }

  listadoOrdenesPendientes(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.get(`${API_BASE_URL}/kitchen/list`, {
      headers
    });
  }
}
