import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { defer, type Observable } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import type { ClientRequest, ClientResponse } from '../models/clientes.models';
import { mockCreateClient, mockDeactivateClient, mockGetClient, mockSearchClients, mockUpdateClient } from './clientes.mock';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly path = '/api/clientes';

  public buscarClientes(search?: string): Observable<ClientResponse[]> {
    if (environment.useMock) return defer(() => mockResponse(mockSearchClients(search)));
    const params = search?.trim() ? new HttpParams().set('search', search.trim()) : new HttpParams();
    return this.http.get<ClientResponse[]>(apiUrl(this.path), { params });
  }

  public obtenerCliente(id: number): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockGetClient(id)));
    return this.http.get<ClientResponse>(apiUrl(`${this.path}/${id}`));
  }

  public crearCliente(request: ClientRequest): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockCreateClient(request)));
    return this.http.post<ClientResponse>(apiUrl(this.path), request);
  }

  public actualizarCliente(id: number, request: ClientRequest): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockUpdateClient(id, request)));
    return this.http.put<ClientResponse>(apiUrl(`${this.path}/${id}`), request);
  }

  public darDeBajaCliente(id: number): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(mockDeactivateClient(id)));
    return this.http.delete<ClientResponse>(apiUrl(`${this.path}/${id}`));
  }
}
