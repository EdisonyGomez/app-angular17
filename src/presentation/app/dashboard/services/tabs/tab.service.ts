import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Tab {
  id: number;             // Identificador único de la pestaña
  title: string;          // Título de la pestaña
  component: Type<any>;   // Componente asociado a la pestaña
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabsSubject = new BehaviorSubject<Tab[]>([]); // Sujeto para almacenar las pestañas
  private activeTabIdSubject = new BehaviorSubject<number | null>(null); // Sujeto para almacenar la pestaña activa

  tabs$ = this.tabsSubject.asObservable(); // Observable para las pestañas
  activeTabId$ = this.activeTabIdSubject.asObservable(); // Observable para la pestaña activa

  /**
   * Agrega una nueva pestaña o cambia a una pestaña existente.
   * Si ya existe una pestaña con el mismo título, se activa esa pestaña.
   * De lo contrario, se crea una nueva pestaña.
   * @param title - Título de la pestaña.
   * @param component - Componente que se asocia a la pestaña.
   */
  addOrSwitchToTab(title: string, component: Type<any>) {
    const tabs = this.tabsSubject.value;
    const existingTabIndex = tabs.findIndex(tab => tab.title === title);

    if (existingTabIndex > -1) {
      this.setActiveTab(tabs[existingTabIndex].id); // Cambia a la pestaña existente
    } else {
      const newTab: Tab = {
        id: this.generateId(), // Genera un nuevo ID para la pestaña
        title,
        component
      };
      this.tabsSubject.next([...tabs, newTab]); // Agrega la nueva pestaña
      this.setActiveTab(newTab.id); // Activa la nueva pestaña
    }
  }

  /**
   * Elimina una pestaña por su ID.
   * Si la pestaña eliminada es la activa, se activa la última pestaña disponible.
   * @param id - ID de la pestaña a eliminar.
   */
  removeTab(id: number) {
    const tabs = this.tabsSubject.value.filter(tab => tab.id !== id);
    this.tabsSubject.next(tabs); // Actualiza la lista de pestañas

    if (this.activeTabIdSubject.value === id) {
      this.setActiveTab(tabs.length > 0 ? tabs[tabs.length - 1].id : null); // Cambia a la última pestaña si la activa fue eliminada
    }
  }

  /**
   * Establece la pestaña activa por su ID.
   * @param id - ID de la pestaña a activar, o null si no hay pestaña activa.
   */
  setActiveTab(id: number | null) {
    this.activeTabIdSubject.next(id); // Actualiza la pestaña activa
  }

  /**
   * Obtiene la pestaña activa actual.
   * @returns La pestaña activa o undefined si no hay ninguna.
   */
  getActiveTab(): Tab | undefined {
    const activeId = this.activeTabIdSubject.value;
    return this.tabsSubject.value.find(tab => tab.id === activeId); // Retorna la pestaña activa
  }

  /**
   * Genera un ID único para una nueva pestaña.
   * @returns Un nuevo ID para la pestaña.
   */
  private generateId(): number {
    return Math.max(0, ...this.tabsSubject.value.map(t => t.id)) + 1; // Genera un ID incrementando el mayor ID existente
  }
}
