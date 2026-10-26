import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { CurrentUser } from '../../../core/session/current-user';
import { environment } from '../../../../environments/environment';
import { mockResumenDia } from './inicio.mock';
import { ResumenDiaDto } from '../models/inicio.models';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = inject(CurrentUser);

  obtenerResumenDia(): Observable<ResumenDiaDto> {
    if (environment.useMock) {
      // El mock se reemplaza al conectar el backend.
      return mockResponse(mockResumenDia(this.currentUser.user()));
    }

    return this.http.get<ResumenDiaDto>(apiUrl('/api/inicio/resumen'));
  }
}
