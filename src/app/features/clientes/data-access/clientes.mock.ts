import { ClientRequest, ClientResponse, ClientSearch } from '../models/clientes.models';

// Datos dummy: se reemplazan al conectar el backend.
let clients: ClientResponse[] = [
  { id: 1, number: 'CLI-00101', name: 'Ana García', document: '30123456', email: 'ana.garcia@example.com', phone: '1123456789', address: 'Av. Central 120', status: 'ACTIVE', audit: { action: 'CREATE', user: 'operador.demo', occurredAt: '2026-02-18T10:15:00-03:00' } },
  { id: 2, number: 'CLI-00102', name: 'Martín López', document: '28456789', email: 'martin.lopez@example.com', phone: '1134567890', address: 'San Martín 450', status: 'ACTIVE', audit: { action: 'UPDATE', user: 'operador.demo', occurredAt: '2026-02-19T11:30:00-03:00' } },
  { id: 3, number: 'CLI-00103', name: 'Lucía Pérez', document: '32567890', email: null, phone: '1145678901', address: null, status: 'INACTIVE', audit: { action: 'DEACTIVATE', user: 'supervisor.demo', occurredAt: '2026-02-20T09:00:00-03:00' } }
];

const copy = (client: ClientResponse): ClientResponse => ({ ...client, audit: { ...client.audit } });

export function mockSearchClients(filters: ClientSearch): ClientResponse[] {
  const matches = (value: string, query?: string) => !query?.trim() || value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  return clients.filter(client => matches(client.name, filters.name) && matches(client.document, filters.document) && matches(client.number, filters.number)).map(copy);
}

export function mockGetClient(id: number): ClientResponse {
  const client = clients.find(item => item.id === id);
  if (!client) throw new Error('No se encontró el cliente.');
  return copy(client);
}

function validate(request: ClientRequest, exceptId?: number): void {
  if (!request.name.trim() || !request.document.trim()) throw new Error('El nombre y el documento son obligatorios.');
  if (clients.some(client => client.document === request.document.trim() && client.id !== exceptId)) throw new Error('Ya existe un cliente con ese documento.');
}

export function mockCreateClient(request: ClientRequest): ClientResponse {
  validate(request);
  const id = Math.max(...clients.map(client => client.id), 0) + 1;
  const client: ClientResponse = { ...request, id, number: `CLI-${String(id + 100).padStart(5, '0')}`, name: request.name.trim(), document: request.document.trim(), status: 'ACTIVE', audit: { action: 'CREATE', user: 'operador.demo', occurredAt: new Date().toISOString() } };
  clients = [...clients, client];
  return copy(client);
}

export function mockUpdateClient(id: number, request: ClientRequest): ClientResponse {
  validate(request, id);
  const previous = mockGetClient(id);
  if (previous.status !== 'ACTIVE') throw new Error('No se puede modificar un cliente inactivo.');
  const updated: ClientResponse = { ...previous, ...request, name: request.name.trim(), document: request.document.trim(), audit: { action: 'UPDATE', user: 'operador.demo', occurredAt: new Date().toISOString() } };
  clients = clients.map(client => client.id === id ? updated : client);
  return copy(updated);
}

export function mockDeactivateClient(id: number): ClientResponse {
  const previous = mockGetClient(id);
  if (previous.status !== 'ACTIVE') throw new Error('El cliente ya está inactivo.');
  // En este ejemplo, el cliente 1 tiene una cuenta con saldo distinto de cero.
  if (id === 1) throw new Error('No se puede dar de baja: el cliente tiene cuentas con saldo distinto de cero.');
  const updated: ClientResponse = { ...previous, status: 'INACTIVE', audit: { action: 'DEACTIVATE', user: 'supervisor.demo', occurredAt: new Date().toISOString() } };
  clients = clients.map(client => client.id === id ? updated : client);
  return copy(updated);
}
