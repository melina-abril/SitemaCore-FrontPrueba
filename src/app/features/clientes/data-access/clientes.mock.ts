import { ClientRequest, ClientResponse } from '../models/client.models';

// Datos mock; se reemplazan al conectar el backend.
let clients: ClientResponse[] = [
  { id: 1, customerNumber: 'CLI-0001', document: '30123456', name: 'Ana Rodríguez', email: 'ana.rodriguez@example.com', phone: '11 4321 1001', status: 'ACTIVE' },
  { id: 2, customerNumber: 'CLI-0002', document: '28987654', name: 'Carlos Pérez', email: 'carlos.perez@example.com', phone: '11 4321 1002', status: 'ACTIVE' },
  { id: 3, customerNumber: 'CLI-0003', document: '33444555', name: 'Lucía Gómez', email: null, phone: '11 4321 1003', status: 'INACTIVE' }
];

export function searchMockClients(search: string): ClientResponse[] {
  const term = search.trim().toLocaleLowerCase();
  return clients.filter(client =>
    client.name.toLocaleLowerCase().includes(term) ||
    client.document.toLocaleLowerCase().includes(term) ||
    client.customerNumber.toLocaleLowerCase().includes(term)
  ).map(client => ({ ...client }));
}

export function getMockClient(id: number): ClientResponse {
  const client = clients.find(item => item.id === id);
  if (!client) throw new Error('No se encontró el cliente.');
  return { ...client };
}

function validate(request: ClientRequest, currentId?: number): void {
  if (!request.document.trim() || !request.name.trim()) {
    throw new Error('El documento y el nombre son obligatorios.');
  }
  if (clients.some(client => client.document === request.document.trim() && client.id !== currentId)) {
    throw new Error('Ya existe un cliente con ese documento.');
  }
}

export function createMockClient(request: ClientRequest): ClientResponse {
  validate(request);
  const id = Math.max(0, ...clients.map(client => client.id)) + 1;
  const client: ClientResponse = {
    id,
    customerNumber: `CLI-${String(id).padStart(4, '0')}`,
    document: request.document.trim(),
    name: request.name.trim(),
    email: request.email?.trim() || null,
    phone: request.phone?.trim() || null,
    status: 'ACTIVE'
  };
  clients = [...clients, client];
  return { ...client };
}

export function updateMockClient(id: number, request: ClientRequest): ClientResponse {
  getMockClient(id);
  validate(request, id);
  const updated: ClientResponse = {
    ...getMockClient(id),
    document: request.document.trim(),
    name: request.name.trim(),
    email: request.email?.trim() || null,
    phone: request.phone?.trim() || null
  };
  clients = clients.map(client => client.id === id ? updated : client);
  return { ...updated };
}

export function deactivateMockClient(id: number): ClientResponse {
  const client = getMockClient(id);
  // En este escenario de ejemplo, el cliente 1 tiene una cuenta con saldo pendiente.
  if (id === 1) throw new Error('No se puede dar de baja: el cliente tiene una cuenta con saldo distinto de cero.');
  if (client.status === 'INACTIVE') throw new Error('El cliente ya está inactivo.');
  const updated: ClientResponse = { ...client, status: 'INACTIVE' };
  clients = clients.map(item => item.id === id ? updated : item);
  return { ...updated };
}
