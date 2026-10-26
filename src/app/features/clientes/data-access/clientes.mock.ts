import { ClientRequest, ClientResponse } from '../models/clientes.models';

// Datos dummy: reemplazar al conectar el backend.
let clients: ClientResponse[] = [
  { id: 1, customerNumber: 'CLI-0001', document: '30123456', name: 'María González', email: 'maria.gonzalez@example.com', phone: '11 4321-5678', status: 'ACTIVE' },
  { id: 2, customerNumber: 'CLI-0002', document: '28456789', name: 'Juan Pérez', email: 'juan.perez@example.com', phone: '11 4567-1234', status: 'ACTIVE' },
  { id: 3, customerNumber: 'CLI-0003', document: '32987654', name: 'Lucía Fernández', email: 'lucia.fernandez@example.com', phone: '11 4123-9876', status: 'INACTIVE' }
];

export function mockSearchClients(search = ''): ClientResponse[] {
  const term = search.trim().toLocaleLowerCase('es');
  return clients.filter(client =>
    [client.name, client.document, client.customerNumber].some(value => value.toLocaleLowerCase('es').includes(term))
  ).map(client => ({ ...client }));
}

export function mockGetClient(id: number): ClientResponse {
  const client = clients.find(item => item.id === id);
  if (!client) throw new Error('No se encontró el cliente.');
  return { ...client };
}

function validate(request: ClientRequest, currentId?: number): void {
  if (!request.document.trim() || !request.name.trim()) throw new Error('El documento y el nombre son obligatorios.');
  if (clients.some(client => client.document === request.document.trim() && client.id !== currentId)) {
    throw new Error('El documento ya pertenece a otro cliente.');
  }
}

export function mockCreateClient(request: ClientRequest): ClientResponse {
  validate(request);
  const id = Math.max(0, ...clients.map(client => client.id)) + 1;
  const client: ClientResponse = { ...request, document: request.document.trim(), name: request.name.trim(), id, customerNumber: `CLI-${String(id).padStart(4, '0')}`, status: 'ACTIVE' };
  clients = [...clients, client];
  return { ...client };
}

export function mockUpdateClient(id: number, request: ClientRequest): ClientResponse {
  const current = mockGetClient(id);
  validate(request, id);
  const updated: ClientResponse = { ...current, ...request, document: request.document.trim(), name: request.name.trim() };
  clients = clients.map(client => client.id === id ? updated : client);
  return { ...updated };
}

export function mockDeactivateClient(id: number): ClientResponse {
  const current = mockGetClient(id);
  // El cliente de ejemplo CLI-0002 tiene una cuenta con saldo pendiente.
  if (id === 2) throw new Error('No se puede dar de baja un cliente con cuentas cuyo saldo no es cero.');
  const updated: ClientResponse = { ...current, status: 'INACTIVE' };
  clients = clients.map(client => client.id === id ? updated : client);
  return { ...updated };
}
