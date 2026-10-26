import type { ClientRequest, ClientResponse } from '../models/clientes.models';

// Datos mock temporales: reemplazar al conectar el backend.
const clients: ClientResponse[] = [
  { id: 1, customerNumber: 'CLI-000001', document: '30123456', name: 'María Fernández', email: 'maria.fernandez@example.com', phone: '11 4321 5678', status: 'ACTIVE' },
  { id: 2, customerNumber: 'CLI-000002', document: '28765432', name: 'Carlos Medina', email: 'carlos.medina@example.com', phone: '11 4567 8901', status: 'ACTIVE' },
  { id: 3, customerNumber: 'CLI-000003', document: '33456789', name: 'Ana Torres', email: 'ana.torres@example.com', phone: '11 4789 1234', status: 'INACTIVE' }
];

export function mockSearchClients(search?: string): ClientResponse[] {
  const term = search?.trim().toLocaleLowerCase('es') ?? '';
  return clients.filter(client => [client.name, client.document, client.customerNumber].some(value => value.toLocaleLowerCase('es').includes(term))).map(client => ({ ...client }));
}

export function mockGetClient(id: number): ClientResponse {
  const client = clients.find(item => item.id === id);
  if (!client) throw new Error('No se encontró el cliente.');
  return { ...client };
}

function validate(request: ClientRequest, exceptId?: number): void {
  if (!request.document.trim() || !request.name.trim()) throw new Error('El documento y el nombre son obligatorios.');
  if (clients.some(client => client.document === request.document.trim() && client.id !== exceptId)) throw new Error('Ya existe un cliente con ese documento.');
}

export function mockCreateClient(request: ClientRequest): ClientResponse {
  validate(request);
  const id = Math.max(0, ...clients.map(client => client.id)) + 1;
  const client: ClientResponse = { ...request, document: request.document.trim(), name: request.name.trim(), id, customerNumber: `CLI-${String(id).padStart(6, '0')}`, status: 'ACTIVE' };
  clients.push(client);
  return { ...client };
}

export function mockUpdateClient(id: number, request: ClientRequest): ClientResponse {
  const client = clients.find(item => item.id === id);
  if (!client) throw new Error('No se encontró el cliente.');
  validate(request, id);
  Object.assign(client, request, { document: request.document.trim(), name: request.name.trim() });
  return { ...client };
}

export function mockDeactivateClient(id: number): ClientResponse {
  const client = clients.find(item => item.id === id);
  if (!client) throw new Error('No se encontró el cliente.');
  if (id === 1) throw new Error('No se puede dar de baja: el cliente tiene una cuenta con saldo distinto de cero.');
  client.status = 'INACTIVE';
  return { ...client };
}
