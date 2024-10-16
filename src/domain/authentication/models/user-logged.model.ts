import { UserModel } from "@domain/users/models/user.model";

/**
 * `UserLoggedModel` es una interfaz que extiende a `UserModel` para representar a un usuario autenticado en la aplicación.
 * 
 * Además de los atributos básicos del usuario heredados de `UserModel`, incluye:
 * - `token`: Un string que representa el token de autenticación (como un JWT) asignado al usuario.
 * - `roles`: Un arreglo de objetos `RoleModel` que define los roles asignados al usuario.
 */
export interface UserLoggedModel extends UserModel {
  token: string;       // Token de autenticación del usuario.
  roles: RoleModel[];  // Lista de roles asociados al usuario.
}

/**
 * `RoleModel` es una interfaz que define la estructura de un rol de usuario en la aplicación.
 * 
 * - `role`: Un string que representa el nombre o identificador del rol asignado al usuario (por ejemplo, "admin" o "user").
 */
export interface RoleModel {
  role: string;  // Nombre del rol asignado al usuario.
}
