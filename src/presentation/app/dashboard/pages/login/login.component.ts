import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { LoginCredentialsModel } from '@domain/authentication/models/login-credentials.model';
import { AuthService } from '@services/auth/auth.service';
import { EMPTY, catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {

  /**
   * Indica si se está procesando una solicitud de inicio de sesión.
   * Se utiliza para deshabilitar el formulario o mostrar un spinner durante la espera.
   */
  processingRequest = false;

  /**
   * Formulario reactivo para capturar las credenciales de inicio de sesión.
   * Contiene dos campos:
   * - `username`: Campo obligatorio para el nombre de usuario.
   * - `password`: Campo obligatorio para la contraseña.
   */
  loginForm = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    })
  });

  /**
   * Constructor del componente.
   * 
   * @param authService Servicio de autenticación utilizado para gestionar el inicio de sesión del usuario.
   * @param cdr (opcional) ChangeDetectorRef para forzar la detección de cambios manualmente cuando se usa OnPush.
   */
  constructor(
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Método de envío del formulario. 
   * Actualmente, solo imprime los valores del formulario en la consola.
   */
  onSubmit() {
    console.log(this.loginForm.value);
  }

  /**
   * Método para manejar el proceso de inicio de sesión.
   * 
   * Valida el formulario y, si es válido, llama al servicio de autenticación para intentar iniciar sesión.
   * También maneja los posibles errores de la solicitud HTTP.
   */
  login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.processingRequest = true;

    this.authService
      .login(this.loginForm.value as LoginCredentialsModel)
      .pipe(
        /**
         * Se ejecuta cuando la solicitud finaliza, para resetear el estado de `processingRequest`.
         */
        finalize(() => (this.processingRequest = false)),
        
        /**
         * Captura errores de la solicitud de inicio de sesión:
         * - Error 400: Se considera un error de autenticación, y se maneja mostrando los errores en el formulario.
         * - Otros errores: Se manejan como errores inesperados.
         */
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.handleUnauthorized(error.error.errors);
            return EMPTY;
          }

          this.handleUnexpectedError();
          throw error;
        })
      )
      .subscribe();
  }

  /**
   * Maneja los errores de autenticación (HTTP 400) estableciendo los errores en el formulario.
   * 
   * @param errors Errores de validación recibidos desde el backend.
   */
  handleUnauthorized(errors: ValidationErrors) {
    this.loginForm.setErrors(errors);
    this.cdr.markForCheck();
  }

  /**
   * Maneja errores inesperados que pueden ocurrir durante el proceso de inicio de sesión.
   * 
   * Establece un error general en el formulario y muestra un mensaje de error al usuario.
   */
  handleUnexpectedError() {
    this.loginForm.setErrors({
      errorUnexpected: true,
      error: "Ocurrió un error inesperado, por favor intente de nuevo más tarde"
    });
    this.cdr.markForCheck();
  }
}
