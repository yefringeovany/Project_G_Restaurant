import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_BASE_URL} from "../../../api.config";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  login(correo_electronico: string, contrasenia: string): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/user/login`, {
      correo_electronico,
      contrasenia
    });
  }

}
