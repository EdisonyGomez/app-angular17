import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { map } from 'rxjs';

/**
 * `isLoggedGuard` es un guardia de ruta que verifica si el usuario está autenticado.
 * 
 * - Si el usuario está autenticado (`isLoggedIn` es `true`), permite el acceso a la ruta.
 * - Si el usuario no está autenticado, lo redirige a la página de login.
 * 
 * @param route Información de la ruta activa que se está verificando.
 * @param state Estado de la ruta actual, incluyendo la URL y otras propiedades.
 * @returns Un observable que emite `true` si el usuario está autenticado, o una redirección a la página de login.
 */
export const isLoggedGuard: CanActivateFn = (route, state) => {

  const router: Router = inject(Router); // Inyecta el servicio de enrutamiento de Angular.

  return inject(AuthService).isLoggedIn$.pipe(
    map((isLoggedIn) => isLoggedIn || router.createUrlTree(['/login'])) // Redirige a login si no está autenticado.
  );
};

/**
 * `isntLoggedGuard` es un guardia de ruta que verifica si el usuario NO está autenticado.
 * 
 * - Si el usuario está autenticado, lo redirige a la página de inicio (`/home`).
 * - Si el usuario no está autenticado (`isLoggedIn` es `false`), permite el acceso a la ruta.
 * 
 * @param route Información de la ruta activa que se está verificando.
 * @param state Estado de la ruta actual, incluyendo la URL y otras propiedades.
 * @returns Un observable que emite `true` si el usuario no está autenticado, o una redirección a la página de inicio.
 */
export const isntLoggedGuard: CanActivateFn = (route, state) => {

  const router: Router = inject(Router); // Inyecta el servicio de enrutamiento de Angular.

  return inject(AuthService).isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return router.createUrlTree(['/home']); // Redirige a home si ya está autenticado.
      }
      return true; // Permite el acceso si no está autenticado.
    })
  );
};
