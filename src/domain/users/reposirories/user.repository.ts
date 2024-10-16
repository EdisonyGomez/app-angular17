import { Injectable } from "@angular/core"; 
import { Observable } from "rxjs"; 
import { UserModel } from "../models/user.model"; 

@Injectable({
    providedIn: 'root'  // Hace que el servicio esté disponible en toda la aplicación.
})
export abstract class UserRepository {
    // Método abstracto para registrar un usuario, recibe un UserModel y retorna un Observable.
    abstract registerUser(params: UserModel): Observable<any>; 

    abstract getUser():Observable<UserModel[]>;

    abstract updateUser(params: UserModel):Observable<UserModel>;
}
