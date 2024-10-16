import { Observable } from "rxjs";
import { RolesRepository } from "../repositories/role.repository";
import { Role} from "../models/role.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CreateRoleUseCase {
  
  constructor(private roleRepository: RolesRepository) {}

 
  execute(role: Role): Observable<{ data: Role; message: string; status: number }> {
    return this.roleRepository.createRole(role);
  }
}
