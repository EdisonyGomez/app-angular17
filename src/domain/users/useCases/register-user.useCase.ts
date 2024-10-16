import { Injectable } from "@angular/core"; 
import { Observable } from "rxjs"; 
import { UserRepository } from "../reposirories/user.repository"; 
import { UserModel } from "../models/user.model"; 

@Injectable({
    providedIn: 'root'  
})
export class RegisterUserUseCase {
    constructor(private userRepository: UserRepository) {}  // Inyección del repositorio de usuarios.

    /**
     * Ejecuta el registro de un nuevo usuario.
     * 
     * @param params - Un objeto UserModel que contiene la información del usuario a registrar.
     * @returns Un Observable que emite la respuesta del registro del usuario.
     */
    execute(params: UserModel): Observable<any> {
        return this.userRepository.registerUser(params); // Llama al método registerUser del repositorio.
    }
}
