import { inject } from '@angular/core';
import { CanMatchFn, Routes, Router } from '@angular/router';
import { CurrentUser } from '../../core/session/current-user';

const supervisorOnly: CanMatchFn = () => inject(CurrentUser).user().role === 'SUPERVISOR' || inject(Router).createUrlTree(['/movimientos']);

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/movimientos-page/movimientos-page').then(module => module.MovimientosPage) },
  { path: 'ajustar/:id', canMatch: [supervisorOnly], loadComponent: () => import('./pages/adjustment-page/adjustment-page').then(module => module.AdjustmentPage) }
];

export default routes;
