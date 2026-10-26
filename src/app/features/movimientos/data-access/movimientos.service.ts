import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { defer, Observable, throwError } from 'rxjs';
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

  public consultarMovimientos(filters: MovimientoFilters): Observable<ConsultaMovimientosResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockConsultarMovimientos(filters)));
    let params = new HttpParams();
    if (filters.cuentaId !== undefined) params = params.set('cuentaId', filters.cuentaId);
    if (filters.desde) params = params.set('desde', filters.desde);
    if (filters.hasta) params = params.set('hasta', filters.hasta);
    return this.http.get<ConsultaMovimientosResponse>(apiUrl(this.path), { params });
  }

  public registrarMovimiento(request: MovimientoRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => this.mockOperation(() => mockRegistrarMovimiento(request, this.currentUser.user().name)));
    return this.http.post<MovimientoResponse>(apiUrl(this.path), request);
  }

  public modificarMovimiento(id: number, request: MovimientoRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => this.mockOperation(() => mockModificarMovimiento(id, request, this.currentUser.user().name)));
    return this.http.put<MovimientoResponse>(apiUrl(`${this.path}/${id}`), request);
  }

  public eliminarMovimiento(id: number): Observable<BajaMovimientoResponse> {
    if (environment.useMock) return defer(() => this.mockOperation(() => mockEliminarMovimiento(id, this.currentUser.user().name)));
    return this.http.delete<BajaMovimientoResponse>(apiUrl(`${this.path}/${id}`));
  }

  public ajustarMovimiento(id: number, request: AjusteRequest): Observable<MovimientoResponse> {
    if (environment.useMock) return defer(() => this.mockOperation(() => mockAjustarMovimiento(id, request, this.currentUser.user().name)));
    return this.http.post<MovimientoResponse>(apiUrl(`${this.path}/${id}/ajustes`), request);
  }

  private mockOperation<T>(operation: () => T): Observable<T> {
    try {
      // Respuesta mock temporal: reemplazar al conectar el backend.
      return mockResponse(operation());
    } catch (error: unknown) {
      return throwError(() => error);
    }
  }
}
