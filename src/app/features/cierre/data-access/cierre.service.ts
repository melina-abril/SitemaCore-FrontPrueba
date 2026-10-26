import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { CierreDto } from '../models/cierre.models';
import { MOCK_CIERRE, MOCK_HISTORIAL } from './cierre.mock';

@Injectable({ providedIn: 'root' })
export class CierreService {
  private readonly http = inject(HttpClient);
  private mockCurrent: CierreDto = { ...MOCK_CIERRE };
  private mockHistory: CierreDto[] = MOCK_HISTORIAL.map(item => ({ ...item }));

  obtenerCierreDiario(): Observable<CierreDto> {
    // El mock se reemplaza al conectar el backend.
    return environment.useMock
      ? mockResponse({ ...this.mockCurrent, saldosCierre: { ...this.mockCurrent.saldosCierre } })
      : this.http.get<CierreDto>(apiUrl('/api/cierre-diario'));
  }

  listarCierres(): Observable<CierreDto[]> {
    return environment.useMock
      ? mockResponse(this.mockHistory.map(item => ({ ...item, saldosCierre: { ...item.saldosCierre } })))
      : this.http.get<CierreDto[]>(apiUrl('/api/cierre-diario/historial'));
  }

  ejecutarCierre(): Observable<CierreDto> {
    if (environment.useMock) {
      return this.completeMock();
    }
    return this.http.post<CierreDto>(apiUrl('/api/cierre-diario/ejecutar'), {});
  }

  reprocesarCierre(): Observable<CierreDto> {
    if (environment.useMock) {
      return this.completeMock();
    }
    return this.http.post<CierreDto>(apiUrl('/api/cierre-diario/reprocesar'), {});
  }

  private completeMock(): Observable<CierreDto> {
    if (this.mockCurrent.estado !== 'PENDIENTE' && this.mockCurrent.estado !== 'CON_ERROR') {
      return mockResponse({ ...this.mockCurrent });
    }
    this.mockCurrent = {
      ...this.mockCurrent,
      estado: 'COMPLETADO',
      totalDebitos: 9200.50,
      totalCreditos: 12750,
      saldosCierre: { 'CTA-1001': 27149.75, 'CTA-1002': 8500 },
      motivoError: null,
      cerradoEn: '2026-07-15T20:12:00Z'
    };
    this.mockHistory = [{ ...this.mockCurrent }, ...this.mockHistory];
    return mockResponse({ ...this.mockCurrent, saldosCierre: { ...this.mockCurrent.saldosCierre } });
  }
}
