import type { Routes } from '@angular/router';
import { supervisorGuard } from '../../core/session/supervisor.guard';

export const CUENTAS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/accounts-page/accounts-page').then((m) => m.AccountsPage) },
  { path: 'supervision/:id', canMatch: [supervisorGuard], loadComponent: () => import('./pages/close-account-page/close-account-page').then((m) => m.CloseAccountPage) },
  { path: ':id', loadComponent: () => import('./pages/account-detail-page/account-detail-page').then((m) => m.AccountDetailPage) }
];
