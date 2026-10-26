import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { CurrentUser } from '../../../core/session/current-user';
import { environment } from '../../../../environments/environment';
import type { ResumenDia } from '../models/inicio.models';
import { createInicioMock } from './inicio.mock';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = inject(CurrentUser);

  public obtenerResumenDia(): Observable<ResumenDia> {
    if (environment.useMock) {
      const user = this.currentUser.user();
      // Respuesta mock temporal: reemplazar al conectar el backend.
      return mockResponse(createInicioMock(user.name, user.role));
    }

    return this.http.get<ResumenDia>(apiUrl('/api/inicio/resumen'));
  }
}
