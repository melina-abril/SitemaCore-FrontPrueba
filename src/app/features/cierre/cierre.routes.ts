import { inject } from '@angular/core';
import { CanMatchFn, Router, Routes } from '@angular/router';
import { CurrentUserService } from '../../core/session/current-user';

const supervisorOnly: CanMatchFn = () =>
  inject(CurrentUserService).user().role === 'SUPERVISOR'
    ? true
    : inject(Router).createUrlTree(['/cierre']);

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cierre-page/cierre-page').then(m => m.CierrePage)
  },
  {
    path: 'ejecutar',
    canMatch: [supervisorOnly],
    data: { action: 'execute' },
    loadComponent: () => import('./pages/close-action-page/close-action-page').then(m => m.CloseActionPage)
  },
  {
    path: 'reproceso',
    canMatch: [supervisorOnly],
    data: { action: 'retry' },
    loadComponent: () => import('./pages/close-action-page/close-action-page').then(m => m.CloseActionPage)
  }
];
