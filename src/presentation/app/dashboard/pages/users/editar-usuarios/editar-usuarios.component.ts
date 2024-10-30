import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Add this import
import { Role } from '@domain/roles/models/role.model';
import { GetRolesUseCase } from '@domain/roles/useCases/get-role.useCase';
import { UserModel } from '@domain/users/models/user.model';
import { GetUserUseCase } from '@domain/users/useCases/get-user.useCase';
import { UpdateUserUseCase } from '@domain/users/useCases/update-user.useCase';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-editar-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CapitalizePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule 
  ],
  templateUrl: './editar-usuarios.component.html',
  styleUrl: './editar-usuarios.component.css'
})
export class EditarUsuariosComponent implements OnInit {
  private getUserUseCase = inject(GetUserUseCase);
  private updateUserUseCase = inject(UpdateUserUseCase);
  private getRolesUseCase = inject(GetRolesUseCase);
  private fb = inject(FormBuilder);

  users = signal<UserModel[]>([]);
  roles = signal<Role[]>([]);
  selectedUser = signal<UserModel | null>(null);

  dataSource!: MatTableDataSource<UserModel>;
  displayedColumns: string[] = ['name', 'username', 'email', 'is_active', 'role_name'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchForm: FormGroup;
  editForm: FormGroup;
  columnSelectForm: FormGroup;

  constructor(private toastr: ToastrService) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });

    this.editForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      username: [''],
      email: ['', [Validators.email]],
      is_active: [true],
      role_name: [''],
      id_role: ['']
    });

    this.columnSelectForm = this.fb.group({
      name: [true],
      username: [true],
      email: [true],
      is_active: [true],
      role_name: [true]
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
    this.setupSearch();
    this.setupColumnSelect();
  }

  loadUsers() {
    this.getUserUseCase.execute().pipe(
      tap(users => {
        this.users.set(users);
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    ).subscribe();
  }

  loadRoles() {
    this.getRolesUseCase.execute().pipe(
      tap(roles => this.roles.set(roles))
    ).subscribe();
  }

  setupSearch() {
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(term => {
      this.dataSource.filter = term.trim().toLowerCase();
    });
  }

  setupColumnSelect() {
    this.columnSelectForm.valueChanges.subscribe(selectedColumns => {
      this.displayedColumns = Object.keys(selectedColumns).filter(key => selectedColumns[key]);
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
        password: '',
        repeat_password: ''
      };

      this.updateUserUseCase.execute(updatedUser).pipe(
        tap((updatedUser) => {
          const index = this.dataSource.data.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.dataSource.data[index] = updatedUser;
            this.dataSource._updateChangeSubscription();
          }
          this.selectedUser.set(null);
          this.toastr.info('Actualizado con éxito!', 'Completado');
        })
      ).subscribe();
    }
  }

  cancelEdit() {
    this.selectedUser.set(null);
    this.editForm.reset();
  }

  exportToExcel(): void {
    // Get only the visible columns based on columnSelectForm
    const visibleColumns = Object.keys(this.columnSelectForm.value)
      .filter(key => this.columnSelectForm.value[key]);

    // Prepare the data for export
    const exportData = this.dataSource.filteredData.map(user => {
      const row: any = {};
      visibleColumns.forEach(col => {
        // Handle special cases for boolean values
        if (col === 'is_active') {
          row[col] = user[col] ? 'Si' : 'No';
        } else {
          row[col] = user[col];
        }
      });
      return row;
    });

     // Create worksheet
     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

     // Translate column headers to Spanish
     const headerTranslations: { [key: string]: string } = {
       name: 'Nombre',
       username: 'Usuario',
       email: 'Email',
       is_active: 'Activo',
       role_name: 'Rol'
      };

  

      // Update column headers
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
      const headerRow = visibleColumns.map(col => headerTranslations[col] || col);
      XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A1' });

      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

      // Generate Excel file
      const now = new Date();
      const fileName = `usuarios_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.xlsx`;
      XLSX.writeFile(wb, fileName);
    }

}

