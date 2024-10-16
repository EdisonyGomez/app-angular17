import { Injectable } from "@angular/core";
import { MenuItemsApi } from "./menu-items.api";
import { Observable } from "rxjs";
import { MenuRepository } from "@domain/menu_items/repositories/menu.repository";

@Injectable({
    providedIn: 'root'
})
export class MenuRepositoryImp extends MenuRepository {

    constructor(private menuItemsApi: MenuItemsApi) {
        super();
    }

    /**
     * Método que sobreescribe `getMenuItems()` de la clase `MenuRepository`.
     * Llama al método `getMenuItems()` de `MenuItemsApi` para obtener los ítems del menú.
     * @returns Observable<[]> - Observable que contiene los ítems del menú en formato de arreglo.
     */
    override getMenuItems(): Observable<[]> {
        return this.menuItemsApi.getMenuItems();
    }
}
