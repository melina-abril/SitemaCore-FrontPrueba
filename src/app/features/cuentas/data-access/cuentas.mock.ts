import { AccountDetail, AccountSummary, OpenRequest } from '../models/cuentas.models';

// Datos de ejemplo: se reemplazan al conectar el backend.
const accounts: AccountDetail[] = [
  {
    id: 101, clienteId: 1, numero: '0001-000101', tipo: 'CORRIENTE', moneda: 'ARS', saldo: 125480.50, estado: 'ACTIVA',
    ultimosMovimientos: [
      { id: 301, fecha: '2026-03-10', tipo: 'CREDITO', concepto: 'Cobro de factura', importe: 25000, saldoResultante: 125480.50 },
      { id: 300, fecha: '2026-03-09', tipo: 'DEBITO', concepto: 'Pago a proveedor', importe: 4800, saldoResultante: 100480.50 }
    ]
  },
  {
    id: 102, clienteId: 1, numero: '0001-000102', tipo: 'AHORRO', moneda: 'USD', saldo: 0, estado: 'ACTIVA',
    ultimosMovimientos: []
  },
  {
    id: 201, clienteId: 2, numero: '0002-000201', tipo: 'AHORRO', moneda: 'ARS', saldo: 0, estado: 'CERRADA',
    ultimosMovimientos: [
      { id: 302, fecha: '2026-03-06', tipo: 'DEBITO', concepto: 'Retiro de fondos', importe: 1500, saldoResultante: 0 }
    ]
  }
];

function summary(account: AccountDetail): AccountSummary {
  const { ultimosMovimientos, ...result } = account;
  return { ...result };
}

export function mockListAccounts(clienteId: number): AccountSummary[] {
  return accounts.filter(account => account.clienteId === clienteId).map(summary);
}

export function mockGetAccount(id: number): AccountDetail | undefined {
  const account = accounts.find(item => item.id === id);
  return account ? { ...account, ultimosMovimientos: account.ultimosMovimientos.map(item => ({ ...item })) } : undefined;
}

export function mockOpenAccount(request: OpenRequest): AccountSummary {
  // En el ejemplo solo los clientes 1 y 2 están activos.
  if (![1, 2].includes(request.clienteId)) throw new Error('Solo se pueden abrir cuentas para clientes activos.');
  const id = Math.max(...accounts.map(account => account.id)) + 1;
  const account: AccountDetail = {
    id, clienteId: request.clienteId, numero: `${String(request.clienteId).padStart(4, '0')}-${String(id).padStart(6, '0')}`,
    tipo: request.tipo, moneda: request.moneda, saldo: 0, estado: 'ACTIVA', ultimosMovimientos: []
  };
  accounts.push(account);
  return summary(account);
}

export function mockCloseAccount(id: number): AccountSummary {
  const account = accounts.find(item => item.id === id);
  if (!account) throw new Error('No se encontró la cuenta.');
  if (account.estado !== 'ACTIVA' || account.saldo !== 0) {
    throw new Error('La cuenta debe estar activa y tener saldo cero para cerrarse.');
  }
  account.estado = 'CERRADA';
  return summary(account);
}
