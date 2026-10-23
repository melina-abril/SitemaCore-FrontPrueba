import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, defer, throwError } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { Account, Detail, OpenRequest } from '../models/cuentas.models';
import { mockCloseAccount, mockGetAccount, mockListAccounts, mockOpenAccount } from './cuentas.mock';

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private readonly http = inject(HttpClient);

  listAccounts(customerId: number): Observable<Account[]> {
    if (environment.useMock) return this.mock(() => mockListAccounts(customerId));
    return this.http.get<Account[]>(apiUrl('/api/cuentas'), {
      params: new HttpParams().set('customerId', customerId)
    });
  }

  getAccount(id: number): Observable<Detail> {
    if (environment.useMock) return this.mock(() => mockGetAccount(id));
    return this.http.get<Detail>(apiUrl(`/api/cuentas/${id}`));
  }

  openAccount(request: OpenRequest): Observable<Account> {
    if (environment.useMock) return this.mock(() => mockOpenAccount(request));
    return this.http.post<Account>(apiUrl('/api/cuentas'), request);
  }

  closeAccount(id: number): Observable<Account> {
    if (environment.useMock) return this.mock(() => mockCloseAccount(id));
    return this.http.patch<Account>(apiUrl(`/api/cuentas/${id}/close`), {});
  }

  private mock<T>(create: () => T): Observable<T> {
    return defer(() => {
      try {
        return mockResponse(create());
      } catch (error) {
        return throwError(() => error);
      }
    });
  }
}
