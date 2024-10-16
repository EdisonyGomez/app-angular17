import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userName: string | null = null;

  constructor(public authService: AuthService,
              private cdr: ChangeDetectorRef
              ){}
  
  logout(){
    this.authService.logout();
  }

  ngOnInit() {
    this.userName = this.authService.getUserName();
    this.cdr.markForCheck();
  }


}
