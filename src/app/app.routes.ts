import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/session/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canMatch: [loginGuard],
    loadChildren: () => import('./features/autenticacion/autenticacion.routes').then(m => m.AUTENTICACION_ROUTES)
  },
  {
    path: '',
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.INICIO_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
