import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { AccountDetail, AccountOpenRequest, AccountSummary } from '../models/account.models';
import { MOCK_ACCOUNT_DETAILS } from './cuentas.mock';

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private readonly http = inject(HttpClient);
  private readonly accounts: AccountDetail[] = MOCK_ACCOUNT_DETAILS.map(account => ({
    ...account,
    ultimosMovimientos: account.ultimosMovimientos.map(movement => ({ ...movement }))
  }));
  private nextId = 1003;

  listarCuentas(clienteId: number): Observable<AccountSummary[]> {
    if (environment.useMock) {
      // El mock se reemplaza al conectar el backend.
      return mockResponse(this.accounts.filter(account => account.clienteId === clienteId).map(account => this.summary(account)));
    }
    return this.http.get<AccountSummary[]>(apiUrl('/api/cuentas'), { params: { clienteId: String(clienteId) } });
  }

  obtenerCuenta(id: number): Observable<AccountDetail> {
    if (environment.useMock) {
      const account = this.accounts.find(item => item.id === id);
      return account
        ? mockResponse({ ...account, ultimosMovimientos: account.ultimosMovimientos.map(movement => ({ ...movement })) })
        : throwError(() => new Error('No se encontró la cuenta.'));
    }
    return this.http.get<AccountDetail>(apiUrl(`/api/cuentas/${id}`));
  }

  abrirCuenta(request: AccountOpenRequest): Observable<AccountSummary> {
    if (environment.useMock) {
      // En la demostración, los clientes 101 y 102 están activos; el backend validará el estado real.
      if (request.clienteId !== 101 && request.clienteId !== 102) {
        return throwError(() => new Error('El cliente no está activo o no existe en los datos de demostración.'));
      }
      const id = this.nextId++;
      const account: AccountDetail = {
        id,
        clienteId: request.clienteId,
        numero: `001-${String(id).padStart(8, '0')}-0`,
        tipo: request.tipo,
        moneda: request.moneda,
        saldo: 0,
        estado: 'ACTIVA',
        ultimosMovimientos: []
      };
      this.accounts.push(account);
      return mockResponse(this.summary(account));
    }
    return this.http.post<AccountSummary>(apiUrl('/api/cuentas'), request);
  }

  cerrarCuenta(id: number): Observable<AccountSummary> {
    if (environment.useMock) {
      const account = this.accounts.find(item => item.id === id);
      if (!account || account.estado !== 'ACTIVA' || account.saldo !== 0) {
        return throwError(() => new Error('La cuenta debe estar activa y tener saldo cero para cerrarse.'));
      }
      account.estado = 'CERRADA';
      return mockResponse(this.summary(account));
    }
    return this.http.patch<AccountSummary>(apiUrl(`/api/cuentas/${id}/cerrar`), {});
  }

  private summary(account: AccountDetail): AccountSummary {
    const { id, clienteId, numero, tipo, moneda, saldo, estado } = account;
    return { id, clienteId, numero, tipo, moneda, saldo, estado };
  }
}
