import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { ClientRequest, ClientResponse, ClientSearch } from '../models/clientes.models';
import { mockCreateClient, mockDeactivateClient, mockGetClient, mockSearchClients, mockUpdateClient } from './clientes.mock';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly path = '/api/clientes';

  private mocked<T>(factory: () => T): Observable<T> {
    try {
      // El mock se reemplaza por las llamadas HTTP al conectar el backend.
      return mockResponse(factory());
    } catch (error) {
      return throwError(() => error);
    }
  }

  searchClients(filters: ClientSearch = {}): Observable<ClientResponse[]> {
    if (environment.useMock) return this.mocked(() => mockSearchClients(filters));
    let params = new HttpParams();
    if (filters.name?.trim()) params = params.set('name', filters.name.trim());
    if (filters.document?.trim()) params = params.set('document', filters.document.trim());
    if (filters.number?.trim()) params = params.set('number', filters.number.trim());
    return this.http.get<ClientResponse[]>(apiUrl(this.path), { params });
  }

  getClient(id: number): Observable<ClientResponse> {
    if (environment.useMock) return this.mocked(() => mockGetClient(id));
    return this.http.get<ClientResponse>(apiUrl(`${this.path}/${id}`));
  }

  createClient(request: ClientRequest): Observable<ClientResponse> {
    if (environment.useMock) return this.mocked(() => mockCreateClient(request));
    return this.http.post<ClientResponse>(apiUrl(this.path), request);
  }

  updateClient(id: number, request: ClientRequest): Observable<ClientResponse> {
    if (environment.useMock) return this.mocked(() => mockUpdateClient(id, request));
    return this.http.put<ClientResponse>(apiUrl(`${this.path}/${id}`), request);
  }

  deactivateClient(id: number): Observable<ClientResponse> {
    if (environment.useMock) return this.mocked(() => mockDeactivateClient(id));
    return this.http.delete<ClientResponse>(apiUrl(`${this.path}/${id}`));
  }
}
