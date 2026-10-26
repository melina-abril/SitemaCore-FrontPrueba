import { Routes } from '@angular/router';

export const INICIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inicio-page/inicio-page').then(({ InicioPage }) => InicioPage)
  }
];
