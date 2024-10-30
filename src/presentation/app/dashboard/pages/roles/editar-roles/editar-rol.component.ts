import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Module } from '@domain/modules/models/module.model';
import { Permission } from '@domain/modules/models/permission.model';
import { AddPermissionsUseCase } from '@domain/modules/useCases/assing-operations-to-role.useCase';
import { GetModulesUseCase } from '@domain/modules/useCases/get-modules.useCase';
import { Role } from '@domain/roles/models/role.model';
import { GetRoleByIdUseCase } from '@domain/roles/useCases/get-role-by-id.useCase';
import { GetRolesUseCase } from '@domain/roles/useCases/get-role.useCase';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-editar-rol',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './editar-rol.component.html',
  styleUrl: './editar-rol.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditarRolComponent implements OnInit {
  private getModulesUseCase = inject(GetModulesUseCase);
  private getRolesUseCase = inject(GetRolesUseCase);
  private getRoleByIdUseCase = inject(GetRoleByIdUseCase);
  private addPermissionsUseCase = inject(AddPermissionsUseCase);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastrService);

  roleForm = this.formBuilder.group({
    selectedRoleId: [''],
  });

  roles = signal<Role[]>([]);
  modules = signal<Module[]>([]);
  selectedRole = signal<Role | null>(null);
  initialPermissions = new Set<number>();
  currentPermissions = new Set<number>();

  ngOnInit() {
    this.loadRoles();
    this.loadModules();
  }

  loadRoles() {
    this.getRolesUseCase.execute().pipe(
      tap((roles) => this.roles.set(roles))
    ).subscribe();
  }

  loadModules() {
    this.getModulesUseCase.execute().pipe(
      tap((modules) => this.modules.set(modules))
    ).subscribe();
  }

  onRoleChange(event: Event) {
    const roleId = +(event.target as HTMLSelectElement).value;
    if (roleId) {
      this.getRoleByIdUseCase.execute(roleId).pipe(
        tap((role) => {
          this.selectedRole.set(role);
          this.initialPermissions.clear();
          this.currentPermissions.clear();
          role.list?.forEach(permission => {
            if (permission.isActive === 1) {
              this.initialPermissions.add(permission.id);
              this.currentPermissions.add(permission.id);
            }
          });
        })
      ).subscribe();
    }
  }

  isPermissionActive(operationId: number): boolean {
    return this.currentPermissions.has(operationId);
  }

  togglePermission(operationId: number) {
    if (this.currentPermissions.has(operationId)) {
      this.currentPermissions.delete(operationId);
    } else {
      this.currentPermissions.add(operationId);
    }
  }

  hasChanges(): boolean {
    return ![...this.initialPermissions].every(id => this.currentPermissions.has(id)) ||
           ![...this.currentPermissions].every(id => this.initialPermissions.has(id));
  }

  savePermissions() {
    if (!this.selectedRole()) return;

    const updatedPermissions: Permission[] = [];
    const roleId = this.selectedRole()!.id!;

    this.modules().forEach(module => {
      module.operations.forEach(operation => {
        const wasActive = this.initialPermissions.has(operation.id);
        const isNowActive = this.currentPermissions.has(operation.id);
        
        if (wasActive !== isNowActive) {
          updatedPermissions.push({
            id: null, // Let the backend handle ID assignment
            role_id: roleId,
            operation_id: operation.id,
            isActive: isNowActive ? 1 : 0,
          });
        }
      });
    });

    if (updatedPermissions.length > 0) {
      this.addPermissionsUseCase.execute(updatedPermissions).pipe(
        tap(() => {
          this.toastr.success('Permisos actualizados con éxito!', 'Completado');
          this.initialPermissions = new Set(this.currentPermissions);
        })
      ).subscribe();
    } else {
      this.toastr.info('No se han realizado cambios en los permisos.', 'Información');
    }
  }
}