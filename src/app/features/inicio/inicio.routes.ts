import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio | Sistema Core',
    loadComponent: () => import('./pages/inicio-page/inicio-page').then(m => m.InicioPage)
  }
];

export default routes;
