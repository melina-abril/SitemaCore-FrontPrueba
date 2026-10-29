import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { CurrentUser } from '../../../core/session/current-user';
import { environment } from '../../../../environments/environment';
import { ResumenDia } from '../models/inicio.models';
import { createResumenDiaMock } from './inicio.mock';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(CurrentUser);

  getDailySummary(): Observable<ResumenDia> {
    if (environment.useMock) {
      // El mock se reemplaza al conectar el backend.
      return mockResponse(createResumenDiaMock(
        this.session.nombre() ?? 'Personal operativo',
        this.session.rol() ?? 'OPERADOR',
      ));
    }
    return this.http.get<ResumenDia>(apiUrl('/api/inicio/resumen'));
  }
}
