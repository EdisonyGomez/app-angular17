import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserApi } from "./user.api";
import { UserRepository } from "@domain/users/reposirories/user.repository";
import { UserModel } from "@domain/users/models/user.model";

@Injectable({
  providedIn: 'root',
})
export class UserRepositoryImpl extends UserRepository {

  constructor(private UserApi: UserApi) {
    super();
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param params Los datos del usuario a registrar encapsulados en un `UserModel`.
   * @returns Un Observable que emite un array de `UserModel` representando el usuario registrado.
   */
  override registerUser(params: UserModel): Observable<UserModel[]> {
    return this.UserApi.registerUser(params);
  }

  override getUser(): Observable<UserModel[]> {
    return this.UserApi.getUser();
  }

  override updateUser(params: UserModel): Observable<UserModel> {
    return this.UserApi.updateUser(params);
  }
}
