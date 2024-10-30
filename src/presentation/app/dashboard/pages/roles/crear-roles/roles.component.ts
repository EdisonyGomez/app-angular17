import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateRoleUseCase } from '@domain/roles/useCases/create-role.useCase';
import { GetModulesUseCase } from '@domain/modules/useCases/get-modules.useCase';
import { AddPermissionsUseCase } from '@domain/modules/useCases/assing-operations-to-role.useCase';
import { Role } from '@domain/roles/models/role.model';
import { Module } from '@domain/modules/models/module.model';
import { Permission } from '@domain/modules/models/permission.model';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CapitalizePipe],
  templateUrl: 'roles.component.html',
  styleUrl: 'roles.component.css',
})
export class RolesComponent implements OnInit {
  private createRoleUseCase = inject(CreateRoleUseCase);
  private getModulesUseCase = inject(GetModulesUseCase);
  private addPermissionsUseCase = inject(AddPermissionsUseCase);
  private formBuilder = inject(FormBuilder);

  // Formulario reactivo para la creación de roles
  roleForm: FormGroup;
  // Lista de módulos cargados en la interfaz
  modules = signal<Module[]>([]);
  // Rol creado tras la creación de un nuevo rol
  createdRole = signal<Role | null>(null);
  // Conjunto de operaciones seleccionadas para asignación de permisos
  selectedOperations = signal<Set<number>>(new Set());

  constructor(private toastr: ToastrService) {
    this.roleForm = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit() {
    this.loadModules();
  }

  /**
   * Carga los módulos desde el caso de uso y los almacena en el estado.
   */
  loadModules() {
    this.getModulesUseCase.execute().pipe(
      tap(modules => this.modules.set(modules))
    ).subscribe();
  }

  /**
   * Crea un nuevo rol si el formulario es válido y actualiza el estado.
   */
  onSubmit() {
    if (this.roleForm.valid) {
      const newRole: Role = {
        id: null,
        description: this.roleForm.get('description')?.value
      };

      this.createRoleUseCase.execute(newRole).pipe(
        tap(response => {
          this.createdRole.set(response.data);
          this.roleForm.reset();
          this.toastr.success('Rol creado con éxito!', 'Completado');
        })
      ).subscribe();
    }
  }

  /**
   * Verifica si un rol ha sido creado.
   * @returns boolean
   */
  isRoleCreated(): boolean {
    return this.createdRole() !== null;
  }

  /**
   * Alterna la selección de operaciones en el conjunto `selectedOperations`.
   * @param operationId ID de la operación a alternar
   */
  toggleOperation(operationId: number) {
    this.selectedOperations.update(operations => {
      const newOperations = new Set(operations);
      if (newOperations.has(operationId)) {
        newOperations.delete(operationId);
      } else {
        newOperations.add(operationId);
      }
      return newOperations;
    });
  }

  /**
   * Asigna los permisos seleccionados al rol creado y resetea el estado de permisos.
   * Muestra una notificación de éxito al completar.
   */
  assignPermissions() {
    if (!this.createdRole()) {
      this.toastr.warning('Primero debes crear un rol antes de asignar permisos', 'Atención');
      return;
    }

    const permissions: Permission[] = Array.from(this.selectedOperations()).map(operationId => ({
      id: null,
      role_id: this.createdRole()!.id!,
      operation_id: operationId,
      isActive: 1
    }));

    this.addPermissionsUseCase.execute(permissions).pipe(
      tap(() => {
        this.selectedOperations.set(new Set());
        this.createdRole.set(null);
        this.toastr.success('Permisos asignados exitosamente!', 'Completado');
      })
    ).subscribe();
  }
}
