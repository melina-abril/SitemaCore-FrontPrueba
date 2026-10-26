import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CurrentUser } from '../../core/session/current-user';

export const movimientosRoutes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/movimientos-page/movimientos-page').then(m => m.MovimientosPage) },
  {
    path: 'ajustes/:id',
    canMatch: [() => inject(CurrentUser).user().role === 'SUPERVISOR' || inject(Router).parseUrl('/movimientos')],
    loadComponent: () => import('./pages/adjustment-page/adjustment-page').then(m => m.AdjustmentPage)
  }
];
