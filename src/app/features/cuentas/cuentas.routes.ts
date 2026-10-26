import { inject } from '@angular/core';
import { CanMatchFn, Router, Routes } from '@angular/router';
import { CurrentUserService } from '../../core/session/current-user';

const supervisorOnly: CanMatchFn = () => inject(CurrentUserService).user().role === 'SUPERVISOR' || inject(Router).parseUrl('/cuentas');

export const CUENTAS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/accounts-page/accounts-page').then(m => m.AccountsPage) },
  { path: 'cerrar/:id', canMatch: [supervisorOnly], loadComponent: () => import('./pages/close-account-page/close-account-page').then(m => m.CloseAccountPage) },
  { path: ':id', loadComponent: () => import('./pages/account-detail-page/account-detail-page').then(m => m.AccountDetailPage) }
];
