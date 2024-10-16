import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "@enviroments/enviroment";
import { UserModel } from '@domain/users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApi {

  constructor(private http: HttpClient) { }

  /**
   * Envía una solicitud HTTP POST para registrar un nuevo usuario.
   * @param params Un objeto de tipo `UserModel` que contiene los datos del usuario a registrar.
   * @returns Un Observable que emite un array de `UserModel` con los datos del usuario registrado.
   */
  registerUser(params: UserModel): Observable<UserModel[]> {
    return this.http.post<UserModel[]>(`${environment.apiUrl}api/v1/user`, params);
  }

  getUser():Observable<UserModel[]>{
    return this.http.get<UserModel[]>(`${environment.apiUrl}api/v1/user`);
  }

  updateUser(params: UserModel):Observable<UserModel>{
    return this.http.put<UserModel>(`${environment.apiUrl}api/v1/user`,params);
  }

}
