import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

export const canActivateAuthGuard = () => {
  if (inject(AuthService).isAuthenticated) {
    return true
  }

  // Попытка обновления токенов
  inject(AuthService).refreshTokens();
  if (inject(AuthService).isAuthenticated) {
    return true
  }

  // Удаление токенов
  inject(CookieService).delete('access_token');
  inject(CookieService).delete('refresh_token');
  return inject(Router).navigate([''])
}
