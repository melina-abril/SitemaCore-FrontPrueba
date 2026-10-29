import { Routes } from '@angular/router';
import { loginGuard } from '../../core/session/auth.guard';

export const AUTENTICACION_ROUTES: Routes = [
  {
    path: '',
    canMatch: [loginGuard],
    title: 'Iniciar sesión · Sistema Core',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
];
