import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { mockResponse } from '../../../core/http/mock-response';
import { mockCreateAdjustment, mockCreateMovement, mockDeleteOpenMovement, mockSearchMovements, mockUpdateOpenMovement } from './movimientos.mock';
import { AdjustmentRequest, MovementDeletionResponse, MovementFilters, MovementRequest, MovementResponse, MovementSearchResponse } from '../models/movimientos.models';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl.replace(/\/$/, '')}/movimientos`;

  searchMovements(filters: MovementFilters = {}): Observable<MovementSearchResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockSearchMovements(filters)));
    let params = new HttpParams();
    if (filters.cuentaId !== undefined) params = params.set('cuentaId', filters.cuentaId);
    if (filters.desde) params = params.set('desde', filters.desde);
    if (filters.hasta) params = params.set('hasta', filters.hasta);
    return this.http.get<MovementSearchResponse>(this.url, { params });
  }

  createMovement(request: MovementRequest): Observable<MovementResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockCreateMovement(request)));
    return this.http.post<MovementResponse>(this.url, request);
  }

  updateOpenMovement(id: number, request: MovementRequest): Observable<MovementResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockUpdateOpenMovement(id, request)));
    return this.http.put<MovementResponse>(`${this.url}/${id}`, request);
  }

  deleteOpenMovement(id: number): Observable<MovementDeletionResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockDeleteOpenMovement(id)));
    return this.http.delete<MovementDeletionResponse>(`${this.url}/${id}`);
  }

  createAdjustment(id: number, request: AdjustmentRequest): Observable<MovementResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockCreateAdjustment(id, request)));
    return this.http.post<MovementResponse>(`${this.url}/${id}/ajustes`, request);
  }
}
