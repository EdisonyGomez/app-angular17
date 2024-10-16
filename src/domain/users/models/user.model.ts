export interface UserModel { 
  id?:number; 
  name: string;            /** Nombre completo del usuario. */
  username: string;       /** Nombre de usuario utilizado para iniciar sesión. */
  password: string;       /** Contraseña del usuario. */
  repeat_password: string; /** Repetición de la contraseña, utilizada para la verificación de coincidencia. */
  email: string;          /** Dirección de correo electrónico del usuario. */
  active: boolean;        /** Indica si el usuario está activo o no. */
  id_role: number;        /** ID del rol asignado al usuario. */
  is_active?:boolean;
  role_name?:string;
}
