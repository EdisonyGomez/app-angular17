import { AuthRepository } from "@domain/authentication/repositories/auth.repository";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@enviroments/enviroment";
import { LoginCredentialsModel } from "@domain/authentication/models/login-credentials.model";
import { Observable, map } from "rxjs";
import { AuthToken } from "@domain/authentication/models/auth.model";

@Injectable({
    providedIn: 'root',
})
export class AuthImplementationRepository extends AuthRepository {
    
    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Método que realiza la autenticación de usuario enviando las credenciales de login.
     * @param params LoginCredentialsModel - Modelo que contiene las credenciales del usuario (email, password).
     * @returns Observable<AuthToken> - Observable que contiene el token JWT y los permisos del usuario.
     */
    login(params: LoginCredentialsModel): Observable<AuthToken> {
        return this.http
            .post<AuthToken>(`${environment.apiUrl}api/v1/auth/authenticate`, params)
            .pipe(
                map((response: any) => {
                    // Retorna un objeto que contiene el JWT y los permisos, si están disponibles
                    return {
                        jwt: response.jwt,
                        permissions: response.permissions || []
                    };
                })
            );
    }


}
