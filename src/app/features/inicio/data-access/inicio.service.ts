import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { CurrentUser } from '../../../core/session/current-user';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { mockDailySummary } from './inicio.mock';
import type { DailySummary } from '../models/inicio.models';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = inject(CurrentUser);

  getDailySummary(): Observable<DailySummary> {
    if (environment.useMock) {
      const user = this.currentUser.user();
      return mockResponse(mockDailySummary(user.name, user.role));
    }

    // Sin caché: cada entrada a Inicio consulta el resumen vigente.
    return this.http.get<DailySummary>(apiUrl('/api/inicio/resumen'));
  }
}
