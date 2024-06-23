import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_BASE_URL } from "../../../api.config";

@Injectable({
  providedIn: 'root'
})
export class PosService {

  constructor(private http: HttpClient) {
  }

  registroOrdenes(monto_total: number, pagado: number, cambio: number, estado: string, menu_items: any[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.http.post(`${API_BASE_URL}/orden/register`, {
      monto_total,
      pagado,
      cambio,
      estado,
      menu_items
    }, {
      headers
    });
  }
}
