import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Role } from '@domain/roles/models/role.model'; 
import { GetRolesUseCase } from '@domain/roles/useCases/get-role.useCase';
import { UserModel } from '@domain/users/models/user.model';
import { RegisterUserUseCase } from '@domain/users/useCases/register-user.useCase';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CapitalizePipe],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css'
})
export class RegistroUsuarioComponent implements OnInit {
  registrationForm: FormGroup; // Formulario de registro de usuario
  roles: Role[] = []; // Lista de roles disponibles
  private destroy$ = new Subject<void>(); // Subject para manejar la suscripción

  constructor(private fb: FormBuilder,
              private getRolesUseCase: GetRolesUseCase,
              private registerUserUseCase: RegisterUserUseCase,
              private toastr: ToastrService
            ) {

    // Inicializa el formulario de registro con validaciones
    this.registrationForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(4)]],
      username: ['',[Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeat_password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      active: [false],
      id_role: ['', Validators.required]
    }, {
      validators: RegistroUsuarioComponent.passwordMatchValidator // Valida que las contraseñas coincidan
    } as AbstractControlOptions);

    // Obtiene los roles al inicializar el componente
    getRolesUseCase.execute().subscribe(rol => {
      this.roles.push(...rol);
    });
  }

  ngOnInit() { }

  /**
   * Valida que las contraseñas coincidan.
   * @param control - Control del formulario que contiene las contraseñas.
   * @returns Un objeto de errores si las contraseñas no coinciden, o null si son válidas.
   */
  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const repeatPassword = control.get('repeat_password');

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      repeatPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      repeatPassword?.setErrors(null);
      return null;
    }
  }

  /**
   * Maneja el envío del formulario de registro.
   * Si el formulario es válido, se registra al usuario y se muestra un mensaje de éxito.
   */
  onSubmit() {
    if (this.registrationForm.valid) {
      const userModel: UserModel = {
        name: this.registrationForm.get('name')?.value,
        username: this.registrationForm.get('username')?.value,
        password: this.registrationForm.get('password')?.value,
        repeat_password: this.registrationForm.get('repeat_password')?.value,
        email: this.registrationForm.get('email')?.value,
        active: this.registrationForm.get('active')?.value,
        id_role: this.registrationForm.get('id_role')?.value
      };
      //Ejecuta el caso de uso para registrar un usuario nuevo
      this.registerUserUseCase.execute(userModel).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.registrationForm.reset(); // Resetea el formulario después de un registro exitoso
          this.toastr.success('Usuario registrado con éxito!', 'Completado'); // Muestra un mensaje de éxito
        },
        error: (error) => {
          // Manejo del error, como mostrar un mensaje de error
        }
      });
    }
  }
}
