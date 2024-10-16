import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs';

export const authInterceptorHttpService: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // No interceptar las solicitudes de autenticación
  if (req.url.includes('api/v1/auth/authenticate')) {
    return next(req);
  }

  return authService.auth$.pipe(
    switchMap(auth => {
      if (auth?.jwt) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${auth.jwt}` }
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};