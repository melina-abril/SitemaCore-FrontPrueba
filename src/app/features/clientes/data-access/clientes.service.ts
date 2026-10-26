import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, defer, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { mockResponse } from '../../../core/http/mock-response';
import { ClientRequest, ClientResponse } from '../models/clientes.models';
import { mockCreateClient, mockDeactivateClient, mockGetClient, mockSearchClients, mockUpdateClient } from './clientes.mock';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl.replace(/\/$/, '')}/clientes`;

  private mocked<T>(factory: () => T): Observable<T> {
    return defer(() => {
      try {
        // El mock se reemplaza al conectar el backend.
        return mockResponse(factory());
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  buscarClientes(search = ''): Observable<ClientResponse[]> {
    if (environment.useMock) return this.mocked(() => mockSearchClients(search));
    const params = search.trim() ? new HttpParams().set('search', search.trim()) : new HttpParams();
    return this.http.get<ClientResponse[]>(this.url, { params });
  }

  obtenerCliente(id: number): Observable<ClientResponse> {
    return environment.useMock ? this.mocked(() => mockGetClient(id)) : this.http.get<ClientResponse>(`${this.url}/${id}`);
  }

  crearCliente(request: ClientRequest): Observable<ClientResponse> {
    return environment.useMock ? this.mocked(() => mockCreateClient(request)) : this.http.post<ClientResponse>(this.url, request);
  }

  actualizarCliente(id: number, request: ClientRequest): Observable<ClientResponse> {
    return environment.useMock ? this.mocked(() => mockUpdateClient(id, request)) : this.http.put<ClientResponse>(`${this.url}/${id}`, request);
  }

  darDeBajaCliente(id: number): Observable<ClientResponse> {
    return environment.useMock ? this.mocked(() => mockDeactivateClient(id)) : this.http.delete<ClientResponse>(`${this.url}/${id}`);
  }
}
