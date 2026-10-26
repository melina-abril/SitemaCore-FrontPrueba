import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { CierreDto } from '../models/cierre.models';
import { mockCierreActual, mockHistorialCierres } from './cierre.mock';

@Injectable({ providedIn: 'root' })
export class CierreService {
  private readonly http = inject(HttpClient);
  private mockActual: CierreDto = { ...mockCierreActual };
  private mockHistorial: CierreDto[] = [...mockHistorialCierres];

  obtenerCierreDiario(): Observable<CierreDto> {
    // El mock se reemplaza al conectar el backend.
    return environment.useMock
      ? mockResponse({ ...this.mockActual, saldosCierre: { ...this.mockActual.saldosCierre } })
      : this.http.get<CierreDto>(apiUrl('/api/cierre-diario'));
  }

  listarCierres(): Observable<CierreDto[]> {
    return environment.useMock
      ? mockResponse(this.mockHistorial.map(cierre => ({ ...cierre, saldosCierre: { ...cierre.saldosCierre } })))
      : this.http.get<CierreDto[]>(apiUrl('/api/cierre-diario/historial'));
  }

  ejecutarCierre(): Observable<CierreDto> {
    if (environment.useMock) {
      if (this.mockActual.estado !== 'PENDIENTE') {
        throw new Error('El cierre de este día ya fue iniciado o completado.');
      }
      return mockResponse(this.completarMock());
    }
    return this.http.post<CierreDto>(apiUrl('/api/cierre-diario/ejecutar'), {});
  }

  reprocesarCierre(): Observable<CierreDto> {
    if (environment.useMock) {
      if (this.mockActual.estado !== 'CON_ERROR') {
        throw new Error('Solo se puede reprocesar un cierre fallido.');
      }
      return mockResponse(this.completarMock());
    }
    return this.http.post<CierreDto>(apiUrl('/api/cierre-diario/reprocesar'), {});
  }

  private completarMock(): CierreDto {
    this.mockActual = {
      ...this.mockActual,
      estado: 'COMPLETADO',
      totalDebitos: 135420.75,
      totalCreditos: 158970.3,
      saldosCierre: { ARS: 2491670.35, USD: 38250 },
      motivoError: null,
      cerradoEn: '2026-02-25T20:12:00Z'
    };
    this.mockHistorial = [this.mockActual, ...this.mockHistorial.filter(cierre => cierre.fechaOperativa !== this.mockActual.fechaOperativa)];
    return { ...this.mockActual, saldosCierre: { ...this.mockActual.saldosCierre } };
  }
}
