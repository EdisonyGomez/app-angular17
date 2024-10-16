import { Routes } from '@angular/router';
import { isLoggedGuard, isntLoggedGuard } from '@guards/auth/is-logged.guard';


export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },


    /**
     * Ruta de Login.
     * 
     * - `path`: Define la ruta `/login`.
     * - `canActivate`: Aplica la guardia `isntLoggedGuard` para evitar que usuarios autenticados accedan a la página de login.
     * - `loadComponent`: Carga de manera asíncrona el componente de login.
     */
    {
        path: 'login',
        canActivate: [isntLoggedGuard],
        loadComponent: () => import('./dashboard/pages/login/login.component'),
    },


    /**
     * Ruta de Home.
     * 
     * - `path`: Define la ruta `/home`.
     * - `canActivate`: Aplica la guardia `isLoggedGuard` para asegurar que solo usuarios autenticados puedan acceder a esta página.
     * - `loadComponent`: Carga de manera asíncrona el componente de inicio (home).
     */
    {
        path: 'home',
        canActivate: [isLoggedGuard],
        loadComponent: () => import('./dashboard/pages/home/home.component'),
    },

    
    /**
     * Ruta Comodín (Wildcard).
     * 
     * - `path`: Captura cualquier ruta no definida previamente.
     * - `redirectTo`: Redirige al usuario a la página de login si la ruta no coincide con ninguna de las anteriores.
     */
    {
        path: '**',
        redirectTo: 'login'
    }
];
