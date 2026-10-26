import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CurrentUserService } from '../../core/session/current-user';

export const clientesRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/client-list-page/client-list-page').then(m => m.ClientListPage) },
  { path: 'new', loadComponent: () => import('./pages/client-detail-page/client-detail-page').then(m => m.ClientDetailPage) },
  {
    path: 'deactivate/:id',
    canMatch: [() => inject(CurrentUserService).user().role === 'SUPERVISOR' || inject(Router).createUrlTree(['/clientes'])],
    loadComponent: () => import('./pages/client-detail-page/client-detail-page').then(m => m.ClientDetailPage)
  },
  { path: ':id', loadComponent: () => import('./pages/client-detail-page/client-detail-page').then(m => m.ClientDetailPage) }
];
