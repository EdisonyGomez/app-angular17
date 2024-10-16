import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators';
import { LoginCredentialsModel } from '@domain/authentication/models/login-credentials.model';
import { UserLoginUseCase } from '@domain/authentication/useCases/user-login.useCase';
import { AuthToken } from '@domain/authentication/models/auth.model'; 
import { JwtService } from './jwt.service';

// Clave para almacenar los datos de autenticación en localStorage
const AUTH_STORAGE_KEY = 'auth_data';

@Injectable({
  providedIn: 'root' // Indica que el servicio puede ser inyectado en toda la aplicación
})
export class AuthService {
  private authSubject = new BehaviorSubject<AuthToken | null>(null); // Subject para almacenar el estado de autenticación
  auth$ = this.authSubject.asObservable(); // Observable para exponer el estado de autenticación

  // Observable que indica si el usuario está autenticado
  isLoggedIn$: Observable<boolean> = this.auth$.pipe(map(auth => !!auth));

  constructor(
    private userLoginUseCase: UserLoginUseCase, // Caso de uso para iniciar sesión
    private router: Router, // Servicio para manejar la navegación
    private jwtService: JwtService

  ) {
    this.loadAuthFromStorage(); // Cargar estado de autenticación desde localStorage al iniciar
  }

  // Método para iniciar sesión
  login(credentials: LoginCredentialsModel): Observable<void> {
    return this.userLoginUseCase.execute(credentials).pipe(
      retry(1), // Reintentar una vez en caso de error
      tap((authResponse: AuthToken) => this.setAuth(authResponse)), // Guardar los datos de autenticación
      switchMap(() => from(this.router.navigateByUrl('/home'))), // Redirigir al usuario a la página de inicio
      catchError((error) => {
        console.error('Login error:', error); // Registrar el error en consola
        return throwError(() => new Error('Login failed')); // Lanzar un error
      }),
      map(() => undefined) // Retornar undefined al finalizar
    );
  }

  // Método para cerrar sesión
  logout(): Observable<any> {
    this.removeAuth(); // Eliminar datos de autenticación
    return of(this.router.navigateByUrl('/login')); // Redirigir al usuario a la página de inicio de sesión
  }
  


  // Método para obtener el token JWT del usuario
  getToken(): string | null {
    return this.authSubject.value?.jwt ?? null; // Retornar el token o null si no existe
  }

  // Método para obtener los permisos del usuario logueado
  getPermissions(): string[] {
    return this.authSubject.value?.permissions ?? []; // Retornar los permisos o un arreglo vacío
  }
  
  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken?.sub || null;
    }
    return null;
  }

  // Método privado para cargar los datos de autenticación desde localStorage
  private loadAuthFromStorage(): void {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY); // Obtener datos del almacenamiento
    if (authData) {
      try {
        const auth: AuthToken = JSON.parse(authData); // Parsear los datos de autenticación
        this.authSubject.next(auth); // Actualizar el subject con los datos
      } catch (error) {
        console.error('Error parsing auth data from storage', error); // Registrar error en consola
        this.removeAuth(); // Eliminar autenticación en caso de error
      }
    }
  }

  // Método privado para establecer los datos de autenticación
  private setAuth(auth: AuthToken): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth)); // Almacenar datos en localStorage
    this.authSubject.next(auth); // Actualizar el subject
  }

  // Método privado para eliminar los datos de autenticación
  private removeAuth(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY); // Eliminar datos de localStorage
    this.authSubject.next(null); // Resetear el subject
  }
}
