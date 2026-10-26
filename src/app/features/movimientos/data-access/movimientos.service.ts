import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, defer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { mockResponse } from '../../../core/http/mock-response';
import { AjusteRequest, BajaResponse, ConsultaResponse, MovimientoFilters, MovimientoRequest, MovimientoResponse } from '../models/movimientos.models';
import { mockAdjust, mockConsult, mockDelete, mockRegister, mockUpdate } from './movimientos.mock';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl.replace(/\/$/, '')}/movimientos`;

  consultarMovimientos(filters: MovimientoFilters): Observable<ConsultaResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockConsult(filters)));
    let params = new HttpParams();
    if (filters.cuentaId !== undefined) params = params.set('cuentaId', filters.cuentaId);
    if (filters.desde) params = params.set('desde', filters.desde);
    if (filters.hasta) params = params.set('hasta', filters.hasta);
    return this.http.get<ConsultaResponse>(this.url, { params });
  }

  registrarMovimiento(request: MovimientoRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockRegister(request)));
    return this.http.post<MovimientoResponse>(this.url, request);
  }

  modificarMovimiento(id: number, request: MovimientoRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockUpdate(id, request)));
    return this.http.put<MovimientoResponse>(`${this.url}/${id}`, request);
  }

  eliminarMovimiento(id: number): Observable<BajaResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockDelete(id)));
    return this.http.delete<BajaResponse>(`${this.url}/${id}`);
  }

  ajustarMovimiento(id: number, request: AjusteRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockAdjust(id, request)));
    return this.http.post<MovimientoResponse>(`${this.url}/${id}/ajustes`, request);
  }
}
