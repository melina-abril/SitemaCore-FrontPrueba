import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import type { AccountDetail, AccountSummary, OpenAccountRequest } from '../models/cuentas.models';
import { mockAccount, mockAccounts, mockCloseAccount, mockOpenAccount } from './cuentas.mock';

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private readonly http = inject(HttpClient);

  public listarCuentas(clienteId: number): Observable<AccountSummary[]> {
    // El mock se reemplaza al conectar el backend.
    if (environment.useMock) return mockResponse(mockAccounts(clienteId));
    return this.http.get<AccountSummary[]>(apiUrl('/api/cuentas'), {
      params: new HttpParams().set('clienteId', clienteId)
    });
  }

  public obtenerCuenta(id: number): Observable<AccountDetail> {
    if (environment.useMock) {
      const account = mockAccount(id);
      return account ? mockResponse(account) : throwError(() => new Error('No se encontró la cuenta.'));
    }
    return this.http.get<AccountDetail>(apiUrl(`/api/cuentas/${id}`));
  }

  public abrirCuenta(request: OpenAccountRequest): Observable<AccountSummary> {
    if (environment.useMock) {
      if (request.clienteId === 102) return throwError(() => new Error('No se puede abrir una cuenta para un cliente inactivo.'));
      return mockResponse(mockOpenAccount(request));
    }
    return this.http.post<AccountSummary>(apiUrl('/api/cuentas'), request);
  }

  public cerrarCuenta(id: number): Observable<AccountSummary> {
    if (environment.useMock) {
      const account = mockCloseAccount(id);
      return account ? mockResponse(account) : throwError(() => new Error('La cuenta debe estar activa y tener saldo cero para cerrarse.'));
    }
    return this.http.patch<AccountSummary>(apiUrl(`/api/cuentas/${id}/cerrar`), {});
  }
}
