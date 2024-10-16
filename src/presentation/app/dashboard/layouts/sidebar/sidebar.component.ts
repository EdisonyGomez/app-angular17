import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TabService } from '@services/tabs/tab.service';
import { RegistroUsuarioComponent } from '../../pages/users/registrar-usuarios/registro-usuario.component';
import { TreeNode } from '@domain/menu_items/models/tree-Node.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RegistroUsuarioComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px' })),  // Estilo cuando el nodo está colapsado
      state('expanded', style({ height: '*' })),      // Estilo cuando el nodo está expandido
      transition('expanded <=> collapsed', animate('300ms ease-in-out')) // Transición de colapso a expansión
    ])
  ]
})
export class SidebarComponent {
  @Input() nodes: TreeNode[] = []; // Arreglo de nodos que se recibe como entrada

  constructor(private tabService: TabService) {}

  /**
   * Alterna el estado de expansión de un nodo.
   * Si el nodo tiene hijos, cambia el estado de expansión. 
   * Si es un nodo hoja, abre una pestaña con su contenido.
   * @param node TreeNode - El nodo que se va a alternar.
   */
  toggleNode(node: TreeNode): void {
    if (node.type === 'folder') {
      node.isExpanded = !node.isExpanded; // Cambia el estado de expansión del nodo
    } else if (node.type === 'view') {
      this.openView(node); // Abre la vista del nodo
    }
  }

  /**
   * Abre una pestaña utilizando el nombre del nodo y su componente asociado.
   * Si no hay componente definido, se muestra una advertencia en la consola.
   * @param node TreeNode - El nodo que se va a abrir como pestaña.
   */
  openView(node: TreeNode): void {
    if (node.component) {
      this.tabService.addOrSwitchToTab(node.name, node.component); // Agrega o cambia a la pestaña
    } else {
    }
  }
}
