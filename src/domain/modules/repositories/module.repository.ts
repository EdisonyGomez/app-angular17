import { Injectable } from "@angular/core";
import { Module } from "../models/module.model";
import { Observable } from "rxjs";
import { Permission } from "../models/permission.model";

@Injectable({
    providedIn:'root'
})
export abstract class ModuleRepository{
    
    abstract getModules(): Observable<Module[]>;
    abstract addPermissions(permissions: Permission[]): Observable<{ message: string; status: number }>;

}