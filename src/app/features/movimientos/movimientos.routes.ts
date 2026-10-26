import { Routes } from '@angular/router';
import { supervisorGuard } from '../../core/session/supervisor-guard';

export const MOVIMIENTOS_ROUTES: Routes = [
  { path: '', title: 'Registro de movimientos', loadComponent: () => import('./pages/movimientos-page/movimientos-page').then(module => module.MovimientosPage) },
  { path: 'ajustes/:id', title: 'Ajustar movimiento', canMatch: [supervisorGuard], loadComponent: () => import('./pages/movimientos-page/movimientos-page').then(module => module.MovimientosPage) }
];
