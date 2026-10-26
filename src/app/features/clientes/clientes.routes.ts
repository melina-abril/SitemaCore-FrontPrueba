import { Routes } from '@angular/router';
import { supervisorGuard } from '../../core/session/supervisor-guard';

export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/client-list-page/client-list-page').then(module => module.ClientListPage)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./pages/client-form-page/client-form-page').then(module => module.ClientFormPage)
  },
  {
    path: ':id/baja',
    canMatch: [supervisorGuard],
    loadComponent: () => import('./pages/client-deactivation-page/client-deactivation-page').then(module => module.ClientDeactivationPage)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/client-form-page/client-form-page').then(module => module.ClientFormPage)
  }
];
