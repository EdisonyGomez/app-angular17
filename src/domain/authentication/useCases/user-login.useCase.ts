import { AuthRepository } from "../repositories/auth.repository";
import { LoginCredentialsModel } from "../models/login-credentials.model";
import { Observable } from "rxjs";
import { AuthToken } from "../models/auth.model";

/**
 * `UserLoginUseCase` es una clase que implementa el caso de uso para iniciar sesión de un usuario.
 * 
 * Esta clase maneja la lógica de negocio para autenticar a un usuario utilizando las credenciales proporcionadas.
 * 
 * No implementa una interfaz `UseCase` en este caso, pero se comporta como un caso de uso que organiza la autenticación.
 */
export class UserLoginUseCase {

    /**
     * Constructor que inyecta el repositorio de autenticación (`AuthRepository`).
     * 
     * @param authRepository Instancia de `AuthRepository` que se utilizará para realizar la autenticación del usuario.
     */
    constructor(private authRepository: AuthRepository) { }

    /**
     * Ejecuta el caso de uso para autenticar al usuario.
     * 
     * Este método llama al método `login` del repositorio de autenticación para autenticar al usuario y obtener un token.
     * 
     * @param params Objeto que contiene las credenciales del usuario (nombre de usuario y contraseña).
     * @returns Observable que emite un `string` con el token de autenticación recibido tras el inicio de sesión.
     */
    execute(params: LoginCredentialsModel): Observable<AuthToken> {
        return this.authRepository.login(params);
      }
}
