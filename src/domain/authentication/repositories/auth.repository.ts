import { LoginCredentialsModel } from "../models/login-credentials.model";
import { Observable } from "rxjs";
import { AuthToken } from "../models/auth.model";

/**
 * `AuthRepository` es una clase abstracta que define la estructura básica para un repositorio de autenticación.
 * 
 * Esta clase es utilizada como una interfaz para implementar diferentes fuentes de datos relacionadas con la autenticación,
 * como servicios que interactúan con una API, almacenamiento local, o cualquier otra fuente de autenticación.
 */
export abstract class AuthRepository {
  
  /**
   * Método abstracto para realizar el inicio de sesión de un usuario.
   * 
   * Este método debe ser implementado por las clases que extiendan `AuthRepository`.
   * Toma las credenciales del usuario (`LoginCredentialsModel`) como parámetro y retorna un observable que emite un token de autenticación (`string`).
   * 
   * @param params Objeto que contiene el nombre de usuario y la contraseña.
   * @returns Observable que emite un `string` con el token de autenticación.
   */
  abstract login(params: LoginCredentialsModel): Observable<AuthToken>;

}
