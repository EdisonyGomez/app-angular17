import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorHttpService } from '@services/auth/auth-interceptor-http.service'; 
import { 
          authImplementationRespositoryProvider, 
          userLoginUseCaseProvider 
        } from '@data/authentication';
import { RolesRepository } from '@domain/roles/repositories/role.repository'; 
import { RolesRepositoryImpl } from '@data/roles/roles-implementation.repository'; 
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MenuRepository } from '@domain/menu_items/repositories/menu.repository';
import { MenuRepositoryImp } from '@data/menu_items/menu-implementation.repositoy';
import { UserRepositoryImpl } from '@data/users/user-implementation.repository';
import { UserRepository } from '@domain/users/reposirories/user.repository';
import { provideToastr } from 'ngx-toastr';
import { ModuleRepository } from '@domain/modules/repositories/module.repository';
import { ModuleRepositoryImpl } from '@data/modules/module-implementation.repository';

// Configuración de la aplicación Angular
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Proveer el enrutador con las rutas definidas
    provideHttpClient(withInterceptors([authInterceptorHttpService])), // Proveer el cliente HTTP con el interceptor de autenticación
    userLoginUseCaseProvider, // Proveer el caso de uso para el inicio de sesión
    authImplementationRespositoryProvider, // Proveer la implementación del repositorio de autenticación
    { provide: RolesRepository, useClass: RolesRepositoryImpl }, // Proveer la implementación del repositorio de roles
    { provide: MenuRepository, useClass: MenuRepositoryImp }, // Proveer la implementación del repositorio de menús
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: ModuleRepository , useClass: ModuleRepositoryImpl },

    provideAnimationsAsync(), // required animations providers
    provideToastr({
      timeOut: 10000,
      preventDuplicates: true,
      progressBar: true
    }),  // Toastr providers
  ]
};
