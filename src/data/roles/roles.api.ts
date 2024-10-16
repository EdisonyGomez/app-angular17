import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../domain/roles/models/role.model';
import { environment } from "@enviroments/enviroment";
import { Permission } from '@domain/modules/models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class RolesApi {
  private http = inject(HttpClient);

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiUrl}api/v1/role`);
  }

  createRole(role: Role): Observable<{ data: Role; message: string; status: number }>  {
    return this.http.post<{ data: Role; message: string; status: number }>(`${environment.apiUrl}api/v1/role`, role);
  }

 
  asignOperationsRole(permissions: Permission[]): Observable<{ message: string; status: number }> {
    return this.http.post<{ message: string; status: number }>(`${environment.apiUrl}api/v1/permission`, permissions);
  }

}