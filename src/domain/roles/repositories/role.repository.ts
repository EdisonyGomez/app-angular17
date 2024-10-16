import { Observable } from "rxjs";
import { Role } from "../models/role.model"; 
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',  // Hace que el servicio esté disponible en toda la aplicación
})
export abstract class RolesRepository {
  /**
   * Clase abstracta `RolesRepository`.
   *  
   * Esta clase define una interfaz de repositorio para trabajar con roles.
   * Los métodos definidos aquí deben ser implementados por una clase concreta que extienda esta clase abstracta.
   * 
   * El repositorio actúa como una abstracción para la fuente de datos (API, base de datos, etc.).
   */
  abstract createRole(role: Role): Observable<{ data: Role; message: string; status: number }>;
  abstract getRoles(): Observable<Role[]>;

}
