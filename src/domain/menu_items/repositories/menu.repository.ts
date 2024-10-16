import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class MenuRepository {
    
    /**
     * Método abstracto que debe ser implementado por las clases que extiendan `MenuRepository`.
     * Este método será utilizado para obtener los ítems del menú, retornando un Observable que contiene un arreglo.
     * @returns Observable<[]> - Observable que contiene los ítems del menú en formato de arreglo.
     */
    abstract getMenuItems(): Observable<[]>;
}
