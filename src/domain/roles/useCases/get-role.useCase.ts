import { Observable } from "rxjs";
import { RolesRepository } from "../repositories/role.repository";
import { Role} from "../models/role.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class GetRolesUseCase {
  /**
   * El caso de uso para obtener la lista de roles desde el repositorio.
   * @param roleRepository Repositorio que proporciona acceso a los roles.
   */
  constructor(private roleRepository: RolesRepository) {}

  /**
   * Ejecuta el caso de uso para obtener los roles disponibles.
   * @returns Un Observable que emite un array de RoleModel con la lista de roles.
   */
  execute(): Observable<Role[]> {
    return this.roleRepository.getRoles();
  }
}
