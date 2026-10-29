import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { CurrentUser } from './current-user';

export const authGuard: CanMatchFn = () => {
  const user = inject(CurrentUser);
  return user.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};

export const loginGuard: CanMatchFn = () => {
  const user = inject(CurrentUser);
  return user.isLoggedIn() ? inject(Router).createUrlTree(['/']) : true;
};
