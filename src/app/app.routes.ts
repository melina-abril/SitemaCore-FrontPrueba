import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.routes) },
  { path: 'clientes', loadChildren: () => import('./features/clientes/clientes.routes').then(m => m.routes) },
  { path: 'cuentas', loadChildren: () => import('./features/cuentas/cuentas.routes').then(m => m.routes) },
  { path: 'movimientos', loadChildren: () => import('./features/movimientos/movimientos.routes').then(m => m.routes) },
  { path: 'cierre', loadChildren: () => import('./features/cierre/cierre.routes').then(m => m.routes) },
  { path: '**', redirectTo: 'inicio' },
];
