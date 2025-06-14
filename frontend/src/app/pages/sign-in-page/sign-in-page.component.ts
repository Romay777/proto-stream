import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-in-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sign-in-page.component.html',
  standalone: true,
  styleUrl: './sign-in-page.component.scss'
})
export class SignInPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null, Validators.required)
  }, { validators: this.atLeastOne(['username', 'email']) });

  cookieService = inject(CookieService);

  onSubmit() {
        if (this.form.value.password != null && (this.form.value.username != null || this.form.value.email != null)) {
          this.authService.login(this.form.value).subscribe(res => {
            this.router.navigate(['main']);
          });
        }
  }

  private atLeastOne(fields: string[]): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const isValid = fields.some(field => !!group.get(field)?.value); // Проверяем, что хотя бы одно поле заполнено
      return isValid ? null : { atLeastOne: true }; // Возвращаем ошибку, если ни одно поле не заполнено
    };
  }
}
