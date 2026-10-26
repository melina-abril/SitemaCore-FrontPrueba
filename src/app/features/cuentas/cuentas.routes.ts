import { Routes } from '@angular/router';
import { supervisorGuard } from '../../core/session/supervisor-guard';

export const CUENTAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Cuentas del cliente',
    loadComponent: () => import('./pages/account-list-page/account-list-page').then(module => module.AccountListPage)
  },
  {
    path: ':id/close',
    canMatch: [supervisorGuard],
    title: 'Cerrar cuenta',
    loadComponent: () => import('./pages/account-close-page/account-close-page').then(module => module.AccountClosePage)
  },
  {
    path: ':id',
    title: 'Detalle de cuenta',
    loadComponent: () => import('./pages/account-detail-page/account-detail-page').then(module => module.AccountDetailPage)
  }
];
