import { Observable } from "rxjs";
import { RolesRepository } from "../../roles/repositories/role.repository";
import { inject, Injectable } from "@angular/core";
import { Permission } from "../models/permission.model";
import { ModuleRepository } from "../repositories/module.repository";

@Injectable({
  providedIn: 'root',
})
export class AddPermissionsUseCase  {
  constructor(private moduleRepository: ModuleRepository) {}

  execute(permissions: Permission[]): Observable<{ message: string; status: number }> {
    return this.moduleRepository.addPermissions(permissions);
  }
}