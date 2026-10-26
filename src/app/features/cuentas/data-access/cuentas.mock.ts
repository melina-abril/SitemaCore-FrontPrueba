import type { AccountDetail, AccountSummary, OpenAccountRequest, RecentMovement } from '../models/cuentas.models';

const accounts: AccountSummary[] = [
  { id: 1, clienteId: 101, numero: '001-00018452', tipo: 'CORRIENTE', moneda: 'ARS', saldo: 125000.5, estado: 'ACTIVA' },
  { id: 2, clienteId: 101, numero: '001-00018453', tipo: 'AHORRO', moneda: 'USD', saldo: 0, estado: 'ACTIVA' },
  { id: 3, clienteId: 103, numero: '001-00019201', tipo: 'AHORRO', moneda: 'ARS', saldo: 0, estado: 'CERRADA' }
];

const movements: RecentMovement[] = [
  { id: 501, fecha: '2026-06-08', tipo: 'CREDITO', concepto: 'Transferencia recibida', importe: 150000.5, saldoResultante: 150000.5 },
  { id: 502, fecha: '2026-06-09', tipo: 'DEBITO', concepto: 'Pago a proveedor', importe: 25000, saldoResultante: 125000.5 }
];

export function mockAccounts(clienteId: number): AccountSummary[] {
  return accounts.filter((account) => account.clienteId === clienteId).map((account) => ({ ...account }));
}

export function mockAccount(id: number): AccountDetail | undefined {
  const account = accounts.find((item) => item.id === id);
  return account ? { ...account, ultimosMovimientos: id === 1 ? movements.map((movement) => ({ ...movement })) : [] } : undefined;
}

export function mockOpenAccount(request: OpenAccountRequest): AccountSummary {
  const id = Math.max(...accounts.map((account) => account.id), 0) + 1;
  const account: AccountSummary = {
    id,
    clienteId: request.clienteId,
    numero: `001-${String(20000 + id).padStart(8, '0')}`,
    tipo: request.tipo,
    moneda: request.moneda,
    saldo: 0,
    estado: 'ACTIVA'
  };
  accounts.push(account);
  return { ...account };
}

export function mockCloseAccount(id: number): AccountSummary | undefined {
  const account = accounts.find((item) => item.id === id && item.estado === 'ACTIVA' && item.saldo === 0);
  if (!account) return undefined;
  account.estado = 'CERRADA';
  return { ...account };
}
