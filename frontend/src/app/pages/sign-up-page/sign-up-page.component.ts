import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sign-up-page.component.html',
  standalone: true,
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  onSubmit() {
    // Предотвращаем стандартное поведение формы
    if (this.form.valid && this.form.value.password && this.form.value.username && this.form.value.email) {
      this.authService.signUp(this.form.value).subscribe({
        next: (res) => {
          if (res.status === 'OK') {
            this.router.navigate(['login']);
          }
        },
        error: (err) => {
          console.error('Ошибка при регистрации:', err);
        }
      });
    }
  }
}
