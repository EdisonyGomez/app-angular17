import { AuthRepository } from '@domain/authentication/repositories/auth.repository';
import { UserLoginUseCase } from '@domain/authentication/useCases/user-login.useCase';
import { AuthImplementationRepository } from './auth-implementation.repository';

// Exporta las clases e interfaces necesarias desde este módulo.
export * from './auth-implementation.repository';
export * from './user-logged.entity';

/**
 * Crea una instancia de `UserLoginUseCase` utilizando el repositorio de autenticación proporcionado.
 * 
 * @param userRepo Instancia de `AuthRepository` utilizada para la autenticación del usuario.
 * @returns Una nueva instancia de `UserLoginUseCase`.
 */
const userLoginUseCaseFactory = 
(userRepo: AuthRepository) => new UserLoginUseCase(userRepo);

/**
 * Proveedor para `UserLoginUseCase` que utiliza la fábrica `userLoginUseCaseFactory`.
 * 
 * Configura la inyección de dependencias para `UserLoginUseCase`, utilizando el repositorio de autenticación como dependencia.
 */
export const userLoginUseCaseProvider = {
    provide: UserLoginUseCase,
    useFactory: userLoginUseCaseFactory,
    deps: [AuthRepository],
};


/**
 * Proveedor para `AuthRepository` que utiliza la implementación concreta `AuthImplementationRepository`.
 * 
 * Configura la inyección de dependencias para `AuthRepository`, proporcionando la implementación específica `AuthImplementationRepository`.
 */
export const authImplementationRespositoryProvider = { 
    provide: AuthRepository, 
    useClass: AuthImplementationRepository 
};
