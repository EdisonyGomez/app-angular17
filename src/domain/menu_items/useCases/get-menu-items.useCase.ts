import { Injectable } from "@angular/core";
import { MenuRepository } from "../repositories/menu.repository";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GetMenuItemsUseCase {
    
    constructor(private menuRepository: MenuRepository) {}

    /**
     * Método principal del caso de uso para obtener los ítems del menú.
     * Utiliza el método `getMenuItems()` del repositorio y retorna un Observable.
     * @returns Observable<[]> - Observable que contiene los ítems del menú.
     */
    execute(): Observable<[]> {
        return this.menuRepository.getMenuItems();
    }
}
