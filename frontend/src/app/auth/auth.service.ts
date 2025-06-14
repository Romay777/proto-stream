import {inject, Injectable} from '@angular/core';
import {FormControl, ɵFormGroupValue, ɵTypedOrUntyped} from '@angular/forms';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CookieService} from "ngx-cookie-service";
import {tap} from 'rxjs';
import {GetUsernameByUserIdResponse, SignUpResponse, TokenResponse} from './auth.interface';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  // accessToken: string | null = null;
  // refreshToken: string | null = null;
  baseApiUrl = environment.apiUrl
  private router: any = inject(Router);
  userAgent: string | null = null;
  isLoggedIn: boolean | undefined;

  get isAuthenticated(): boolean {
    const authToken = this.cookieService.get("access_token");
    if (authToken != null) {
      const accessTokenDecoded = JSON.parse(atob(authToken!.split('.')[1]));
      if (accessTokenDecoded.exp * 1000 > Date.now()) {
        return true;
      }
    }
    return false;
  }

  get getUserIdFromToken(): string | null {
    const authToken = this.cookieService.get("access_token");
    if (authToken != null) {
      const accessTokenDecoded = JSON.parse(atob(authToken!.split('.')[1]));
      if (accessTokenDecoded.user_id) {
        return accessTokenDecoded.user_id;
      }
      return null;
    }
    return null;
  }

  login(payload: ɵTypedOrUntyped<{ username: FormControl<null>; email: FormControl<null>; password: FormControl<null> }, ɵFormGroupValue<{
    username: FormControl<null>;
    email: FormControl<null>;
    password: FormControl<null>
  }>, any>){
    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}auth/sign-in`,
      payload,
    ).pipe(
      tap(val => {
        this.cookieService.set('access_token', val.access_token);
        this.cookieService.set('refresh_token', val.refresh_token);
      })
    )
  }

  signUp(value: any) {
    const payload = {
      username: value.username,
      email: value.email,
      password: value.password
    };
    return this.http.post<SignUpResponse>(
      `${this.baseApiUrl}auth/sign-up`,
      payload,
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
  ).pipe(
      tap(val => {
        console.log(val.status);
        console.log(val.error);
      })
    );
  }

  signOut(value: any) {
    const payload = {
      refresh_token: this.cookieService.get("refresh_token")
    };
    return this.http.post<SignUpResponse>(
      `${this.baseApiUrl}auth/sign-out`,
      payload,
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      tap(val => {
        this.cookieService.delete('access_token');
        this.cookieService.delete('refresh_token');
        console.log(val.status);
        console.log(val.error);
      })
    );
  }

  refreshTokens() {
    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}auth/refresh-tokens`,
      {
        refresh_token: this.cookieService.get("refresh_token"),
        userAgent: this.userAgent
      }
    ).pipe(
      tap(val => {
        this.cookieService.delete('access_token');
        this.cookieService.delete('refresh_token');
        this.cookieService.set('access_token', val.access_token);
        this.cookieService.set('refresh_token', val.refresh_token);
      })
    )
  }

  getUsernameByUserId(userId: string) {
    this.refreshTokens()
    const payload = {
      user_id: userId,
    };
    return this.http.post<GetUsernameByUserIdResponse>(
      `${this.baseApiUrl}auth/get-username-by-id`,
      payload,
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      tap(val => {
        console.log(val);
      })
    );
  }
}
