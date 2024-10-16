import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '@domain/roles/models/role.model';
import { GetRolesUseCase } from '@domain/roles/useCases/get-role.useCase';
import { UserModel } from '@domain/users/models/user.model';
import { GetUserUseCase } from '@domain/users/useCases/get-user.useCase';
import { UpdateUserUseCase } from '@domain/users/useCases/update-user.useCase';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-editar-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-usuarios.component.html',
  styleUrl: './editar-usuarios.component.css'
})
export class EditarUsuariosComponent {
  private getUserUseCase = inject(GetUserUseCase);
  private updateUserUseCase = inject(UpdateUserUseCase);
  private getRolesUseCase = inject(GetRolesUseCase);
  private fb = inject(FormBuilder);

  users = signal<UserModel[]>([]);
  filteredUsers = signal<UserModel[]>([]);
  roles = signal<Role[]>([]);
  selectedUser = signal<UserModel | null>(null);

  searchForm: FormGroup;
  editForm: FormGroup;

  constructor(private toastr: ToastrService) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });

    this.editForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      username: [''],
      email: ['', [Validators.email]],
      active: [true],
      role_name: [''],
      id_role: ['']
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
    this.setupSearch();
  }

  loadUsers() {
    this.getUserUseCase.execute().pipe(
      tap(users => {
        this.users.set(users);
        this.filteredUsers.set(users);
      })
    ).subscribe();
  }

  loadRoles() {
    this.getRolesUseCase.execute().pipe(
      tap(roles => this.roles.set(roles))
    ).subscribe();
  }

  setupSearch() {
    this.searchForm.get('searchTerm')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      const lowercaseTerm = term.toLowerCase();
      const filtered = this.users().filter(user => 
        user.name.toLowerCase().includes(lowercaseTerm) ||
        user.email.toLowerCase().includes(lowercaseTerm) ||
        user.username.toLowerCase().includes(lowercaseTerm)
      );
      this.filteredUsers.set(filtered);
    });
  }

  editUser(user: UserModel) {
    this.selectedUser.set(user);
    this.editForm.patchValue({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      id_role: user.id_role,
      role_name: user.role_name
    });
  }

  updateUser() {
    if (this.editForm.valid && this.selectedUser()) {
      const updatedUser: UserModel = {
        ...this.editForm.value,
        password: '', // We don't update the password here
        repeat_password: '' // We don't update the repeat password here
      };

      this.updateUserUseCase.execute(updatedUser).pipe(
        tap((updatedUser) => {
          this.users.update(users => {
            const index = users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              users[index] = updatedUser;
            }
            return users;
          });
          this.filteredUsers.update(users => {
            const index = users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              users[index] = updatedUser;
            }
            return users;
          });
          this.selectedUser.set(null);
        })
      ).subscribe();
      this.toastr.info('Actualizado con éxito!', 'Completado'); // Muestra un mensaje de éxito

    }
  }

  cancelEdit() {
    this.selectedUser.set(null);
    this.editForm.reset();
  }
}