import type { Routes } from '@angular/router';
import { supervisorGuard } from '../../core/session/supervisor.guard';

export const CLIENTES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/client-list/client-list').then(m => m.ClientList) },
  { path: 'nuevo', loadComponent: () => import('./pages/client-form/client-form').then(m => m.ClientForm) },
  { path: 'baja/:id', canMatch: [supervisorGuard], loadComponent: () => import('./pages/client-deactivate/client-deactivate').then(m => m.ClientDeactivate) },
  { path: ':id', loadComponent: () => import('./pages/client-form/client-form').then(m => m.ClientForm) }
];
