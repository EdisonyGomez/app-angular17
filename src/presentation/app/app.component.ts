import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistroUsuarioComponent } from "./dashboard/pages/users/registrar-usuarios/registro-usuario.component";
import { RolesComponent } from "./dashboard/pages/roles/crear-roles/roles.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegistroUsuarioComponent, RolesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export  class AppComponent {
  title = 'AkcAngular_frontWebApps2';

}
