import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { CurrentUser } from './current-user';

export const supervisorGuard: CanMatchFn = () => {
  const currentUser = inject(CurrentUser);
  const router = inject(Router);
  return currentUser.user().role === 'SUPERVISOR' ? true : router.parseUrl('/inicio');
};
