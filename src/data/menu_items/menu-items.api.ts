import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "@enviroments/enviroment";

@Injectable({
    providedIn: 'root',
})

export class MenuItemsApi {
    constructor(private http: HttpClient){
    }
    
    /**
     * Método que realiza una solicitud HTTP GET para obtener los ítems del menú.
     * Hace uso del `HttpClient` para conectarse con la API.
     * @returns Observable<[]> - Observable que contiene los ítems del menú en formato de arreglo.
     */
    getMenuItems(): Observable<[]>{
        return this.http.get<[]>(`${environment.apiUrl}api/v1/tree/user`);
    }

}