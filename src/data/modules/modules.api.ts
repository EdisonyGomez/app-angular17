import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "@enviroments/enviroment";
import { Module } from '@domain/modules/models/module.model';
import { Permission } from '@domain/modules/models/permission.model';

@Injectable({
    providedIn: 'root',
})
export class ModulesApi {

    constructor(private http: HttpClient) {}

    
    getModules(): Observable<Module[]> {
        return this.http.get<Module[]>(`${environment.apiUrl}api/v1/module`);
    }

    asignOperationsRole(permissions: Permission[]): Observable<{ message: string; status: number }> {
        return this.http.post<{ message: string; status: number }>(`${environment.apiUrl}api/v1/permission`, permissions);
      }

}
