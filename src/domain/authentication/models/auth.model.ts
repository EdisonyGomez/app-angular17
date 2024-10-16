export interface AuthToken {
  /**
   * El token JWT (JSON Web Token) que se utiliza para autenticar al usuario.
   */
  jwt: string;

  /**
   * Una lista de permisos asociados al usuario, representada como un array de cadenas.
   */
  permissions: string[];
}
