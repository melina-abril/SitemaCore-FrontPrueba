import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { CurrentUser } from './current-user';

export const supervisorGuard: CanMatchFn = () =>
  inject(CurrentUser).isSupervisor() ? true : inject(Router).parseUrl('/inicio');
