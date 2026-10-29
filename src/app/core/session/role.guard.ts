import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { CurrentUser } from './current-user';
import { Rol } from './role';

export function roleGuard(rol: Rol): CanMatchFn {
  return () => {
    const user = inject(CurrentUser);
    const router = inject(Router);
    if (!user.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }
    return user.rol() === rol ? true : router.createUrlTree(['/']);
  };
}
