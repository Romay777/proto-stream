import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  authService = inject(AuthService);
  cookieService = inject(CookieService);
  router = inject(Router);

  onSubmit() {
      this.authService.signOut(this.cookieService.get("refresh_token")).subscribe({
        next: (res) => {
          if (res.status === 'OK') {
            this.router.navigate(['login']);
          }
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.error('Ошибка при выходе:', err);
        }
      });
  }
}
