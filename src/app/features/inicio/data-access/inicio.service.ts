import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUser } from '../../../core/session/current-user';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { mockResumenDia } from './inicio.mock';
import { ResumenDiaDto } from '../models/inicio.models';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = inject(CurrentUser);

  obtenerResumenDia(): Observable<ResumenDiaDto> {
    if (environment.useMock) {
      const user = this.currentUser.user();
      return mockResponse(mockResumenDia(user.name, user.role));
    }
    return this.http.get<ResumenDiaDto>(apiUrl('/api/inicio/resumen'));
  }
}
