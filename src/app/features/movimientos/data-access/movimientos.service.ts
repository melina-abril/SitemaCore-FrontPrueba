import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { CurrentUser } from '../../../core/session/current-user';
import { environment } from '../../../../environments/environment';
import { AjusteRequest, BajaMovimientoResponse, ConsultaMovimientosResponse, MovimientoFilters, MovimientoRequest, MovimientoResponse } from '../models/movimientos.models';
import { mockAjustarMovimiento, mockConsultarMovimientos, mockEliminarMovimiento, mockModificarMovimiento, mockRegistrarMovimiento } from './movimientos.mock';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = inject(CurrentUser);
  private readonly path = '/api/movimientos';

  consultarMovimientos(filters: MovimientoFilters): Observable<ConsultaMovimientosResponse> {
    // El mock se reemplaza al conectar el backend.
    if (environment.useMock) return defer(() => mockResponse(mockConsultarMovimientos(filters)));
    let params = new HttpParams();
    if (filters.cuentaId !== undefined) params = params.set('cuentaId', String(filters.cuentaId));
    if (filters.desde) params = params.set('desde', filters.desde);
    if (filters.hasta) params = params.set('hasta', filters.hasta);
    return this.http.get<ConsultaMovimientosResponse>(apiUrl(this.path), { params });
  }

  registrarMovimiento(request: MovimientoRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockRegistrarMovimiento(request, this.currentUser.user().name)));
    return this.http.post<MovimientoResponse>(apiUrl(this.path), request);
  }

  modificarMovimiento(id: number, request: MovimientoRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockModificarMovimiento(id, request, this.currentUser.user().name)));
    return this.http.put<MovimientoResponse>(apiUrl(`${this.path}/${id}`), request);
  }

  eliminarMovimiento(id: number): Observable<BajaMovimientoResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockEliminarMovimiento(id, this.currentUser.user().name)));
    return this.http.delete<BajaMovimientoResponse>(apiUrl(`${this.path}/${id}`));
  }

  ajustarMovimiento(id: number, request: AjusteRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockAjustarMovimiento(id, request, this.currentUser.user().name)));
    return this.http.post<MovimientoResponse>(apiUrl(`${this.path}/${id}/ajustes`), request);
  }
}
