import { Account, Detail, OpenRequest, RecentMovement } from '../models/cuentas.models';

// Datos mock a reemplazar al conectar el backend.
const accounts: Account[] = [
  { id: 101, customerId: 1, number: '0001-00001234', type: 'Caja de ahorro', currency: 'ARS', balance: 125000, status: 'OPEN' },
  { id: 102, customerId: 1, number: '0001-00005678', type: 'Cuenta corriente', currency: 'ARS', balance: 0, status: 'OPEN' },
  { id: 103, customerId: 3, number: '0001-00009123', type: 'Caja de ahorro', currency: 'USD', balance: 850, status: 'OPEN' }
];

const movements: Record<number, RecentMovement[]> = {
  101: [
    { id: 501, type: 'CREDIT', amount: 150000, date: '2026-04-15', concept: 'Depósito', resultingBalance: 150000 },
    { id: 502, type: 'DEBIT', amount: 25000, date: '2026-04-16', concept: 'Pago de servicios', resultingBalance: 125000 }
  ],
  103: [{ id: 503, type: 'CREDIT', amount: 850, date: '2026-04-14', concept: 'Depósito', resultingBalance: 850 }]
};

export function mockListAccounts(customerId: number): Account[] {
  return accounts.filter(account => account.customerId === customerId).map(account => ({ ...account }));
}

export function mockGetAccount(id: number): Detail {
  const account = accounts.find(item => item.id === id);
  if (!account) throw new Error('No se encontró la cuenta.');
  return { account: { ...account }, recentMovements: (movements[id] ?? []).map(item => ({ ...item })) };
}

export function mockOpenAccount(request: OpenRequest): Account {
  if (request.customerId === 2) throw new Error('Solo se pueden abrir cuentas para clientes activos.');
  if (request.customerId < 1) throw new Error('Ingresá un número de cliente válido.');
  const id = Math.max(...accounts.map(account => account.id)) + 1;
  const account: Account = {
    id,
    customerId: request.customerId,
    number: `0001-${String(id).padStart(8, '0')}`,
    type: request.type,
    currency: request.currency,
    balance: 0,
    status: 'OPEN'
  };
  accounts.push(account);
  return { ...account };
}

export function mockCloseAccount(id: number): Account {
  const account = accounts.find(item => item.id === id);
  if (!account) throw new Error('No se encontró la cuenta.');
  if (account.status !== 'OPEN') throw new Error('La cuenta ya está cerrada.');
  if (account.balance !== 0) throw new Error('La cuenta debe tener saldo cero para cerrarse.');
  account.status = 'CLOSED';
  return { ...account };
}
