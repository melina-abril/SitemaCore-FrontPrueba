import { Routes } from '@angular/router';
import { supervisorGuard } from '../../core/session/supervisor-guard';

export const CIERRE_ROUTES: Routes = [
  {
    path: '',
    canMatch: [supervisorGuard],
    loadComponent: () => import('./pages/cierre-page/cierre-page').then(m => m.CierrePage)
  }
];
