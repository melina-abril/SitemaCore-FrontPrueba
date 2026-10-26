import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, defer, throwError } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { AccountDetail, AccountSummary, OpenRequest } from '../models/cuentas.models';
import { mockCloseAccount, mockGetAccount, mockListAccounts, mockOpenAccount } from './cuentas.mock';

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private readonly http = inject(HttpClient);

  listarCuentas(clienteId: number): Observable<AccountSummary[]> {
    if (environment.useMock) return defer(() => mockResponse(mockListAccounts(clienteId)));
    return this.http.get<AccountSummary[]>(apiUrl('/api/cuentas'), { params: new HttpParams().set('clienteId', clienteId) });
  }

  obtenerCuenta(id: number): Observable<AccountDetail> {
    if (environment.useMock) return defer(() => {
      const account = mockGetAccount(id);
      return account ? mockResponse(account) : throwError(() => new Error('No se encontró la cuenta.'));
    });
    return this.http.get<AccountDetail>(apiUrl(`/api/cuentas/${encodeURIComponent(id)}`));
  }

  abrirCuenta(request: OpenRequest): Observable<AccountSummary> {
    if (environment.useMock) return defer(() => {
      try { return mockResponse(mockOpenAccount(request)); }
      catch (error) { return throwError(() => error); }
    });
    return this.http.post<AccountSummary>(apiUrl('/api/cuentas'), request);
  }

  cerrarCuenta(id: number): Observable<AccountSummary> {
    if (environment.useMock) return defer(() => {
      try { return mockResponse(mockCloseAccount(id)); }
      catch (error) { return throwError(() => error); }
    });
    return this.http.patch<AccountSummary>(apiUrl(`/api/cuentas/${encodeURIComponent(id)}/cerrar`), {});
  }
}
