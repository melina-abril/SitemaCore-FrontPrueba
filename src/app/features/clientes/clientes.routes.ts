import { inject } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';
import { CurrentUserService } from '../../core/session/current-user';

const supervisorOnly: CanMatchFn = () => inject(CurrentUserService).user().role === 'SUPERVISOR';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/client-list-page/client-list-page').then(m => m.ClientListPage) },
  { path: 'new', loadComponent: () => import('./pages/client-form-page/client-form-page').then(m => m.ClientFormPage) },
  { path: ':id/edit', loadComponent: () => import('./pages/client-form-page/client-form-page').then(m => m.ClientFormPage) },
  { path: ':id/deactivate', canMatch: [supervisorOnly], loadComponent: () => import('./pages/client-detail-page/client-detail-page').then(m => m.ClientDetailPage) },
  { path: ':id', loadComponent: () => import('./pages/client-detail-page/client-detail-page').then(m => m.ClientDetailPage) }
];

export default routes;
