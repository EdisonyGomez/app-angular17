export interface TreeNode {
  id: number;         // Identificador único del nodo
  name: string;       // Nombre o etiqueta del nodo
  children?: TreeNode[]; // Arreglo opcional de nodos hijos, de tipo TreeNode, formando la estructura de árbol
  type: 'folder' | 'view';     // Tipo de nodo, que podría definir si es una carpeta o vista
  component?: any; // Nuevo campo para almacenar el componente asociado
  isExpanded?: boolean;     // Estado de expansión del nodo (true si está expandido)

}

