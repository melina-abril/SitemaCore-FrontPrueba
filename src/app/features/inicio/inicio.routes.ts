import { Routes } from '@angular/router';

export const INICIO_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio · Sistema Core',
    loadComponent: () => import('./pages/inicio-page/inicio-page').then((m) => m.InicioPage),
  },
];
