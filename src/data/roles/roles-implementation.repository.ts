import { Injectable } from "@angular/core";
import { Role} from "@domain/roles/models/role.model";
import { RolesRepository } from "@domain/roles/repositories/role.repository";
import { Observable } from "rxjs";
import { RolesApi } from "./roles.api";


  @Injectable({
    providedIn: 'root',
  })
    
  export class RolesRepositoryImpl extends RolesRepository {

    constructor(private rolesApi: RolesApi) {
      super(); // Llama al constructor de la clase base (RolesRepository)
    }
  
    /**
     * Sobrescribe el método `getRoles` de la clase abstracta `RolesRepository`.
     * Llama al método `getRoles` de `RolesApi` para obtener los roles.
     * @returns Un Observable que emite un array de `RoleModel`.
     */
    override getRoles(): Observable<Role[]> {
      return this.rolesApi.getRoles();
    }



    override createRole(role: Role): Observable<{ data: Role; message: string; status: number }>{
      return this.rolesApi.createRole(role);
    }

    // override asignOperationsRole(permissions:[ { role_id: number; operation_id: number }]): Observable<any> {
    //   return this.rolesApi.assingOperationsToRole(permissions);
    // }
  }