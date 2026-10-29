import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, timer } from 'rxjs';

import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/autenticacion.models';
import { mockFailedAttempts, mockLogin, mockLogout } from './autenticacion.mock';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly http = inject(HttpClient);

  login(request: LoginRequest): Observable<LoginResponse> {
    if (environment.useMock) {
      // La verificación simulada se reemplaza por el backend al desactivar useMock.
      return timer(120).pipe(map(() => mockLogin(request)));
    }
    return this.http.post<LoginResponse>(apiUrl('/auth/login'), request);
  }

  logout(): Observable<void> {
    if (environment.useMock) {
      mockLogout();
      return mockResponse<void>(undefined);
    }
    return this.http.post<void>(apiUrl('/auth/logout'), {});
  }

  failedAttempts(usuario: string): number | null {
    return environment.useMock ? mockFailedAttempts(usuario) : null;
  }
}
