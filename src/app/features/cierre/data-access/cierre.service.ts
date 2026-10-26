import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { mockResponse } from '../../../core/http/mock-response';
import { DailyClose } from '../models/cierre.models';
import { mockCloseHistory, mockDailyClose } from './cierre.mock';

@Injectable({ providedIn: 'root' })
export class CierreService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl.replace(/\/$/, '')}/cierre-diario`;
  private current: DailyClose = structuredClone(mockDailyClose);
  private history: DailyClose[] = structuredClone(mockCloseHistory);

  getDailyClose(): Observable<DailyClose> {
    return environment.useMock
      ? mockResponse(structuredClone(this.current))
      : this.http.get<DailyClose>(this.url);
  }

  listDailyCloses(): Observable<DailyClose[]> {
    return environment.useMock
      ? mockResponse(structuredClone(this.history))
      : this.http.get<DailyClose[]>(`${this.url}/historial`);
  }

  executeDailyClose(): Observable<DailyClose> {
    if (!environment.useMock) return this.http.post<DailyClose>(this.url, {});
    // El mock conserva el resultado durante esta sesión; reemplazar al conectar el backend.
    if (this.current.estado === 'PENDIENTE') this.completeMockClose();
    return mockResponse(structuredClone(this.current));
  }

  retryDailyClose(): Observable<DailyClose> {
    if (!environment.useMock) return this.http.post<DailyClose>(`${this.url}/reproceso`, {});
    // El reproceso mock conserva el resultado durante esta sesión.
    if (this.current.estado === 'CON_ERROR') this.completeMockClose();
    return mockResponse(structuredClone(this.current));
  }

  private completeMockClose(): void {
    this.current = {
      ...this.current, estado: 'COMPLETADO', totalDebitos: 192340.75,
      totalCreditos: 205780.25,
      saldosCierre: { 'CTA-1001': 135200.50, 'CTA-1002': 79450 },
      motivoError: null
    };
    this.history = [structuredClone(this.current), ...this.history];
  }
}
