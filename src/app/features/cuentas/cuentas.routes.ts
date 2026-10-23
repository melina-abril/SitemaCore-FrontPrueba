import { inject } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';
import { CurrentUser } from '../../core/session/current-user';

const supervisorOnly: CanMatchFn = () => inject(CurrentUser).user().role === 'SUPERVISOR';

export const routes: Routes = [
  {
    path: '',
    title: 'Cuentas del cliente',
    loadComponent: () => import('./pages/accounts-page/accounts-page').then(m => m.AccountsPage)
  },
  {
    path: 'cerrar/:id',
    title: 'Cerrar cuenta',
    canMatch: [supervisorOnly],
    loadComponent: () => import('./pages/account-detail-page/account-detail-page').then(m => m.AccountDetailPage),
    data: { closeMode: true }
  },
  {
    path: ':id',
    title: 'Detalle de cuenta',
    loadComponent: () => import('./pages/account-detail-page/account-detail-page').then(m => m.AccountDetailPage)
  }
];
