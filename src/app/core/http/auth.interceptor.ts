import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { CurrentUser } from '../session/current-user';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const user = inject(CurrentUser);
  const router = inject(Router);
  const token = user.token();
  const authorizedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;
  const isLogin = request.url.split('?')[0].endsWith('/auth/login');

  return next(authorizedRequest).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const renewedToken = event.headers.get('X-Auth-Token');
        if (renewedToken) {
          user.updateToken(renewedToken);
        }
      }
    }),
    catchError((error: unknown) => {
      // Solo un 401 de una request que llevaba token es una sesión vencida; sin token (p. ej. justo
      // después de cerrar sesión) no hay nada que avisar.
      if (error instanceof HttpErrorResponse && error.status === 401 && !isLogin && token) {
        user.clear();
        void router.navigate(['/login'], { queryParams: { expired: 'true' } });
      }
      return throwError(() => error);
    })
  );
};
