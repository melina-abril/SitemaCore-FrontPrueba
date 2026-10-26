import { inject } from '@angular/core';
import { CanMatchFn, Router, Routes } from '@angular/router';
import { CurrentUserService } from '../../core/session/current-user';

const supervisorOnly: CanMatchFn = () => {
  const user = inject(CurrentUserService).user();
  return user.role === 'SUPERVISOR' ? true : inject(Router).createUrlTree(['/inicio']);
};

export const routes: Routes = [
  {
    path: '',
    canMatch: [supervisorOnly],
    loadComponent: () => import('./pages/cierre-page/cierre-page').then(module => module.CierrePage)
  }
];
