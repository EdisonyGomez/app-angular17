import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateRoleUseCase } from '@domain/roles/useCases/create-role.useCase';
import { GetModulesUseCase } from '@domain/modules/useCases/get-modules.useCase';
import { AddPermissionsUseCase } from '@domain/modules/useCases/assing-operations-to-role.useCase';
import { Role } from '@domain/roles/models/role.model';
import { Module } from '@domain/modules/models/module.model';
import { Permission } from '@domain/modules/models/permission.model';
import { Observable, tap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'roles.component.html',
  styleUrl: 'roles.component.css',
  // template: `
  //   <div class="container mx-auto p-4">
  //     <h1 class="text-2xl font-bold mb-6">Gestión de Roles y Permisos</h1>
      
  //     <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  //       <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
  //         <div class="mb-4">
  //           <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
  //             Descripción del Rol
  //           </label>
  //           <input
  //             class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //             id="description"
  //             type="text"
  //             formControlName="description"
  //             placeholder="Ingrese la descripción del rol"
  //           >
  //         </div>
          
  //         @if (isRoleCreated()) {
  //           <div class="mb-6">
  //             <h2 class="text-xl font-semibold mb-4">Asignar Permisos para: {{ createdRole()?.description }}</h2>
  //             @for (module of modules(); track module.id) {
  //               <details class="mb-4">
  //                 <summary class="font-bold cursor-pointer">{{ module.description }}</summary>
  //                 <div class="pl-4 mt-2">
  //                   @for (operation of module.operations; track operation.id) {
  //                     <div class="flex items-center mb-2">
  //                       <input
  //                         type="checkbox"
  //                         [id]="'operation-' + operation.id"
  //                         [value]="operation.id"
  //                         (change)="toggleOperation(operation.id)"
  //                         [checked]="selectedOperations().has(operation.id)"
  //                         class="mr-2"
  //                       >
  //                       <label [for]="'operation-' + operation.id">{{ operation.description }}</label>
  //                     </div>
  //                   }
  //                 </div>
  //               </details>
  //             }
  //           </div>
  //         }
          
  //         <div class="flex items-center justify-between">
  //           @if (!isRoleCreated()) {
  //             <button
  //               class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  //               type="submit"
  //               [disabled]="roleForm.invalid"
  //             >
  //               Crear Rol
  //             </button>
  //           } @else {
  //             <button
  //               class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  //               type="button"
  //               (click)="assignPermissions()"
  //               [disabled]="selectedOperations().size === 0"
  //             >
  //               Asignar Permisos
  //             </button>
  //           }
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // `
  
  

})
export class RolesComponent implements OnInit {
  private createRoleUseCase = inject(CreateRoleUseCase);
  private getModulesUseCase = inject(GetModulesUseCase);
  private addPermissionsUseCase = inject(AddPermissionsUseCase);
  private formBuilder = inject(FormBuilder);

  roleForm: FormGroup;
  modules = signal<Module[]>([]);
  createdRole = signal<Role | null>(null);
  selectedOperations = signal<Set<number>>(new Set());

  constructor(private toastr: ToastrService) {
    this.roleForm = this.formBuilder.group({
      description: ['',[Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit() {
    this.loadModules();
  }

  loadModules() {
    this.getModulesUseCase.execute().pipe(
      tap(modules => this.modules.set(modules))
    ).subscribe();
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const newRole: Role = {
        id: null,
        description: this.roleForm.get('description')?.value
      };

      this.createRoleUseCase.execute(newRole).pipe(
        tap(response => {
          console.log(response.message);
          this.createdRole.set(response.data);
          this.roleForm.reset();
        })
      ).subscribe();
      this.toastr.success('Rol creado con éxito!', 'Completado'); // Muestra un mensaje de éxito

    }
  }

  isRoleCreated(): boolean {
    return this.createdRole() !== null;
  }

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

  assignPermissions() {
    if (!this.createdRole()) {
      console.error('No role created');
      return;
    }

    const permissions: Permission[] = Array.from(this.selectedOperations()).map(operationId => ({
      role_id: this.createdRole()!.id!,
      operation_id: operationId
    }));

    this.addPermissionsUseCase.execute(permissions).pipe(
      tap(response => {
        console.log(response.message);
        this.selectedOperations.set(new Set());
        this.createdRole.set(null);
      })
    ).subscribe();
  }
}