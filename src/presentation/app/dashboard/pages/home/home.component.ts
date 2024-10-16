import { Component, OnInit } from '@angular/core';  
import { AuthService } from '@services/auth/auth.service';
import { SidebarComponent } from '../../layouts/sidebar/sidebar.component'; 
import { RolesComponent } from '../roles/crear-roles/roles.component';  
import { HeaderComponent } from "../../layouts/header/header.component"; 
import { TabService } from '@services/tabs/tab.service';  
import { GetMenuItemsUseCase } from '@domain/menu_items/useCases/get-menu-items.useCase';  
import { TreeNode } from '@domain/menu_items/models/tree-Node.model';
import { RegistroUsuarioComponent } from "../users/registrar-usuarios/registro-usuario.component";  
import { CommonModule, AsyncPipe } from '@angular/common';
import { EditarUsuariosComponent } from '../users/editar-usuarios/editar-usuarios.component';

@Component({
  selector: 'app-home',  
  standalone: true,  
  imports: [
    CommonModule,
    AsyncPipe,
    SidebarComponent,
    RolesComponent,
    HeaderComponent,
    RegistroUsuarioComponent
  ],  
  templateUrl: './home.component.html',  
  styleUrl: './home.component.css'  
})
export default class HomeComponent implements OnInit {

  isSidebarHidden = false; // Propiedad para controlar la visibilidad del sidebar
  treeData: TreeNode[] = []; // Arreglo que contiene los datos del menú en formato de árbol (TreeNode[])

  /**
   * Alterna la visibilidad del sidebar.
   */
  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden; // Cambia el estado de visibilidad del sidebar
  }

  /**
   * Constructor que inyecta los servicios necesarios.
   * @param getMenuItemsUseCase - Caso de uso para obtener los ítems del menú.
   * @param authService - Servicio de autenticación.
   * @param tabService - Servicio para gestionar las tabs (pestañas).
   */
  constructor(
    private getMenuItemsUseCase: GetMenuItemsUseCase,  
    private authService: AuthService,  
    public tabService: TabService  
  ) { }

  /**
   * Método del ciclo de vida OnInit que se ejecuta cuando el componente es inicializado.
   * Llama al caso de uso para obtener los ítems del menú y asigna los datos al árbol.
   */
  ngOnInit(): void {
    this.getMenuItemsUseCase.execute().subscribe(items => {
      this.treeData = this.filterTreeData(items);  // Filtra los datos del árbol antes de asignarlos
    });
  }

  /**
   * Método privado para filtrar los datos del árbol.
   * Excluye nodos de tipo 'folder' que no tengan hijos.
   * @param nodes - Arreglo de nodos a filtrar.
   * @returns Arreglo filtrado de nodos en formato TreeNode[].
   */
  private filterTreeData(nodes: TreeNode[]): TreeNode[] {
    return nodes
      .filter(node => node.type !== 'folder' || (node.children && node.children.length > 0))
      .map(node => ({
        ...node,
        children: node.children ? this.filterTreeData(node.children) : undefined,
        component: this.getComponentForNode(node) // Asigna un componente si corresponde
      }));
  }

  /**
   * Asigna un componente específico a un nodo según su nombre.
   * @param node - El nodo para el cual se desea obtener el componente.
   * @returns Componente asociado al nodo, o null si no hay ninguno.
   */
  private getComponentForNode(node: TreeNode): any {
    if (node.name === 'Crear usuarios') {
      return RegistroUsuarioComponent; // Asigna el componente de registro de usuarios
    }
    if(node.name === 'Crear roles'){
      return RolesComponent
    }
    if(node.name === 'Asignar Permisos'){
      return EditarUsuariosComponent
    }
    return null; // Si no hay coincidencias, retorna null
  }

  /**
   * Cierra sesión llamando al servicio de autenticación.
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Obtiene la pestaña activa desde el servicio de tabs.
   * @returns La pestaña activa.
   */
  get activeTab() {
    return this.tabService.getActiveTab();
  }

  /**
   * Cierra una pestaña basada en su ID.
   * @param id - ID de la pestaña a cerrar.
   */
  closeTab(id: number) {
    this.tabService.removeTab(id); // Cierra la pestaña
  }

  /**
   * Activa una pestaña basada en su ID.
   * @param id - ID de la pestaña a activar.
   */
  setActiveTab(id: number) {
    this.tabService.setActiveTab(id); // Activa la pestaña
  }
}
