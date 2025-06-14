import { Routes } from '@angular/router';
import {SignInPageComponent} from './pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './pages/sign-up-page/sign-up-page.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {canActivateAuthGuard} from './auth/auth.guard';
import {VideoPageComponent} from './pages/video-page/video-page.component';

export const routes: Routes = [
  {path: '', component: SignInPageComponent},
  {path: 'login', component: SignInPageComponent},
  {path: 'register', component: SignUpPageComponent},
  {path: 'main', component: MainPageComponent},
  {path: 'video', component: VideoPageComponent}
];
