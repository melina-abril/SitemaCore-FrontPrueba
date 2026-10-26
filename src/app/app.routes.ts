import { Routes } from '@angular/router';
import { supervisorGuard } from './core/session/supervisor.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.routes) },
  { path: 'clientes', loadChildren: () => import('./features/clientes/clientes.routes').then(m => m.clientesRoutes) },
  { path: 'cuentas', loadChildren: () => import('./features/cuentas/cuentas.routes').then(m => m.CUENTAS_ROUTES) },
  { path: 'movimientos', loadChildren: () => import('./features/movimientos/movimientos.routes').then(m => m.routes) },
  { path: 'cierre', canMatch: [supervisorGuard], loadChildren: () => import('./features/cierre/cierre.routes').then(m => m.routes) },
  { path: '**', redirectTo: 'inicio' }
];
