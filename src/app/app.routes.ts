import { Routes } from '@angular/router';
import { supervisorGuard } from './core/session/supervisor.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'inicio',
    title: 'Inicio · Sistema Core',
    loadChildren: () => import('./features/inicio/inicio.routes').then(module => module.INICIO_ROUTES)
  },
  {
    path: 'clientes',
    title: 'Clientes · Sistema Core',
    loadChildren: () => import('./features/clientes/clientes.routes').then(module => module.CLIENTES_ROUTES)
  },
  {
    path: 'cuentas',
    title: 'Cuentas · Sistema Core',
    loadChildren: () => import('./features/cuentas/cuentas.routes').then(module => module.CUENTAS_ROUTES)
  },
  {
    path: 'movimientos',
    title: 'Movimientos · Sistema Core',
    loadChildren: () => import('./features/movimientos/movimientos.routes').then(module => module.MOVIMIENTOS_ROUTES)
  },
  {
    path: 'cierre',
    title: 'Cierre diario · Sistema Core',
    canMatch: [supervisorGuard],
    loadChildren: () => import('./features/cierre/cierre.routes').then(module => module.CIERRE_ROUTES)
  },
  { path: '**', redirectTo: 'inicio' }
];
