import { UserEntity } from "@data/users/user.entity";

/**
 * `UserLoggedEntity` extiende `UserEntity` para incluir información adicional relevante para usuarios autenticados.
 * 
 * Esta interfaz representa la estructura de los datos de un usuario que ha iniciado sesión, incluyendo el token
 * de autenticación y los roles del usuario.
 */
export interface UserLoggedEntity extends UserEntity {
    /**
     * Token de autenticación del usuario.
     * 
     * Este token es utilizado para autenticar las solicitudes del usuario al servidor.
     */
    token: string;

    /**
     * Lista de roles asignados al usuario.
     * 
     * Cada rol define los permisos y el acceso que el usuario tiene en la aplicación.
     */
    roles: RoleEntity[];
}

/**
 * `RoleEntity` representa un rol asignado a un usuario.
 * 
 * Esta interfaz define la estructura de un rol que puede ser asignado a un usuario en el sistema.
 */
export interface RoleEntity {
    /**
     * Nombre del rol.
     * 
     * Define el tipo de rol o permiso que tiene el usuario. Por ejemplo, "admin", "user", etc.
     */
    role: string;
}
