import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, defer } from 'rxjs';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { environment } from '../../../../environments/environment';
import { ClientRequest, ClientResponse } from '../models/client.models';
import { createMockClient, deactivateMockClient, getMockClient, searchMockClients, updateMockClient } from './clientes.mock';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);

  buscarClientes(search = ''): Observable<ClientResponse[]> {
    if (environment.useMock) return defer(() => mockResponse(searchMockClients(search)));
    return this.http.get<ClientResponse[]>(apiUrl('/api/clientes'), { params: search.trim() ? { search: search.trim() } : {} });
  }

  obtenerCliente(id: number): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(getMockClient(id)));
    return this.http.get<ClientResponse>(apiUrl(`/api/clientes/${id}`));
  }

  crearCliente(request: ClientRequest): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(createMockClient(request)));
    return this.http.post<ClientResponse>(apiUrl('/api/clientes'), request);
  }

  actualizarCliente(id: number, request: ClientRequest): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(updateMockClient(id, request)));
    return this.http.put<ClientResponse>(apiUrl(`/api/clientes/${id}`), request);
  }

  darDeBajaCliente(id: number): Observable<ClientResponse> {
    if (environment.useMock) return defer(() => mockResponse(deactivateMockClient(id)));
    return this.http.delete<ClientResponse>(apiUrl(`/api/clientes/${id}`));
  }
}
