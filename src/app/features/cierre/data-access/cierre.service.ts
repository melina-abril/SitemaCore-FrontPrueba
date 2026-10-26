import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import type { DailyClosing } from '../models/cierre.models';
import { MOCK_CLOSING_HISTORY, MOCK_COMPLETED_CLOSING, MOCK_DAILY_CLOSING } from './cierre.mock';

@Injectable({ providedIn: 'root' })
export class CierreService {
  private readonly http = inject(HttpClient);
  private mockClosing: DailyClosing = { ...MOCK_DAILY_CLOSING, saldosCierre: {} };

  public getDailyClosing(): Observable<DailyClosing> {
    if (environment.useMock) {
      return mockResponse(this.copy(this.mockClosing));
    }
    return this.http.get<DailyClosing>(apiUrl('/api/cierre-diario'));
  }

  public listClosings(): Observable<DailyClosing[]> {
    if (environment.useMock) {
      return mockResponse(MOCK_CLOSING_HISTORY.map((closing) => this.copy(closing)));
    }
    return this.http.get<DailyClosing[]>(apiUrl('/api/cierre-diario/historial'));
  }

  public executeClosing(): Observable<DailyClosing> {
    if (environment.useMock) {
      // Respuesta mock temporal: reemplazar al conectar el backend.
      this.mockClosing = this.copy(MOCK_COMPLETED_CLOSING);
      return mockResponse(this.copy(this.mockClosing));
    }
    return this.http.post<DailyClosing>(apiUrl('/api/cierre-diario/ejecutar'), {});
  }

  public retryClosing(): Observable<DailyClosing> {
    if (environment.useMock) {
      // Respuesta mock temporal: reemplazar al conectar el backend.
      this.mockClosing = this.copy(MOCK_COMPLETED_CLOSING);
      return mockResponse(this.copy(this.mockClosing));
    }
    return this.http.post<DailyClosing>(apiUrl('/api/cierre-diario/reprocesar'), {});
  }

  private copy(closing: DailyClosing): DailyClosing {
    return { ...closing, saldosCierre: { ...closing.saldosCierre } };
  }
}
