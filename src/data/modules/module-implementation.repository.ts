import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ModulesApi } from "./modules.api";
import { ModuleRepository } from "@domain/modules/repositories/module.repository";
import { Module } from "@domain/modules/models/module.model";
import { Permission } from "@domain/modules/models/permission.model";


  @Injectable({
    providedIn: 'root',
  })
    
  export class ModuleRepositoryImpl extends ModuleRepository {

    constructor(private moduleApi: ModulesApi) {
      super();
    }
  
   
    override getModules(): Observable<Module[]> {
      return this.moduleApi.getModules();
    }

    override addPermissions(permissions: Permission[]): Observable<{ message: string; status: number }>{
      return this.moduleApi.asignOperationsRole(permissions);
    }

  }