import { AjusteRequest, BajaResponse, ConsultaResponse, MovimientoFilters, MovimientoRequest, MovimientoResponse } from '../models/movimientos.models';

const today = (): string => new Date().toISOString().slice(0, 10);
const yesterday = (): string => new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const openingBalances: Record<number, number> = { 1001: 4000, 1002: 1000 };
let nextId = 5;

// Datos de demostración: se reemplazan al conectar el backend.
let movements: MovimientoResponse[] = [
  { id: 1, cuentaId: 1001, tipo: 'CREDITO', importe: 500, fechaOperativa: yesterday(), concepto: 'Depósito en caja', usuario: 'operador.demo', registradoEn: `${yesterday()}T10:30:00-03:00`, cerrado: true, saldoResultante: 4500, movimientoOriginalId: null },
  { id: 2, cuentaId: 1001, tipo: 'DEBITO', importe: 200, fechaOperativa: today(), concepto: 'Pago a proveedor', usuario: 'operador.demo', registradoEn: `${today()}T09:15:00-03:00`, cerrado: false, saldoResultante: 4300, movimientoOriginalId: null },
  { id: 3, cuentaId: 1001, tipo: 'CREDITO', importe: 800, fechaOperativa: today(), concepto: 'Cobro de factura', usuario: 'operador.demo', registradoEn: `${today()}T11:20:00-03:00`, cerrado: false, saldoResultante: 5100, movimientoOriginalId: null },
  { id: 4, cuentaId: 1002, tipo: 'CREDITO', importe: 250, fechaOperativa: today(), concepto: 'Transferencia recibida', usuario: 'operador.demo', registradoEn: `${today()}T12:05:00-03:00`, cerrado: false, saldoResultante: 1250, movimientoOriginalId: null }
];

function sorted(items: MovimientoResponse[]): MovimientoResponse[] {
  return [...items].sort((a, b) => a.fechaOperativa.localeCompare(b.fechaOperativa) || a.registradoEn.localeCompare(b.registradoEn) || a.id - b.id);
}

function recalculate(items: MovimientoResponse[]): MovimientoResponse[] {
  const balances = { ...openingBalances };
  return sorted(items).map(item => {
    const previous = balances[item.cuentaId] ?? 0;
    const balance = Math.round((previous + (item.tipo === 'DEBITO' ? -item.importe : item.importe)) * 100) / 100;
    if (balance < 0) throw new Error('El débito no puede dejar la cuenta con saldo negativo.');
    balances[item.cuentaId] = balance;
    return { ...item, saldoResultante: balance };
  });
}

function checkRequest(request: MovimientoRequest): void {
  if (!Number.isInteger(request.cuentaId) || request.cuentaId <= 0) throw new Error('Ingrese una cuenta válida.');
  if (request.tipo !== 'DEBITO' && request.tipo !== 'CREDITO') throw new Error('Seleccione débito o crédito.');
  if (!Number.isFinite(request.importe) || request.importe <= 0) throw new Error('El importe debe ser mayor que cero.');
  if (!request.concepto.trim()) throw new Error('Ingrese un concepto.');
  if (!request.fechaOperativa || request.fechaOperativa < today()) throw new Error('No se aceptan movimientos en un día cerrado.');
}

export function mockConsult(filters: MovimientoFilters): ConsultaResponse {
  const items = movements.filter(item =>
    (filters.cuentaId === undefined || item.cuentaId === filters.cuentaId) &&
    (!filters.desde || item.fechaOperativa >= filters.desde) &&
    (!filters.hasta || item.fechaOperativa <= filters.hasta)
  );
  const accountHistory = filters.cuentaId === undefined ? [] : movements.filter(item => item.cuentaId === filters.cuentaId && (!filters.hasta || item.fechaOperativa <= filters.hasta));
  return { movimientos: items.map(item => ({ ...item })), saldoResultante: filters.cuentaId === undefined ? 0 : (accountHistory.at(-1)?.saldoResultante ?? openingBalances[filters.cuentaId] ?? 0) };
}

export function mockRegister(request: MovimientoRequest): MovimientoResponse {
  checkRequest(request);
  const item: MovimientoResponse = { ...request, id: nextId, usuario: 'operador.demo', registradoEn: new Date().toISOString(), cerrado: false, saldoResultante: 0, movimientoOriginalId: null };
  const updated = recalculate([...movements, item]);
  nextId++;
  movements = updated;
  return { ...updated.find(movement => movement.id === item.id)! };
}

export function mockUpdate(id: number, request: MovimientoRequest): MovimientoResponse {
  const original = movements.find(item => item.id === id);
  if (!original) throw new Error('No se encontró el movimiento.');
  if (original.cerrado) throw new Error('Un movimiento cerrado solo se corrige con un ajuste.');
  checkRequest(request);
  const updated = recalculate(movements.map(item => item.id === id ? { ...item, ...request, usuario: 'operador.demo', registradoEn: new Date().toISOString() } : item));
  movements = updated;
  return { ...updated.find(item => item.id === id)! };
}

export function mockDelete(id: number): BajaResponse {
  const original = movements.find(item => item.id === id);
  if (!original) throw new Error('No se encontró el movimiento.');
  if (original.cerrado) throw new Error('Un movimiento cerrado solo se corrige con un ajuste.');
  movements = recalculate(movements.filter(item => item.id !== id));
  return { id, estado: 'BAJA', usuario: 'operador.demo', registradoEn: new Date().toISOString() };
}

export function mockAdjust(id: number, request: AjusteRequest): MovimientoResponse {
  const original = movements.find(item => item.id === id);
  if (!original) throw new Error('No se encontró el movimiento original.');
  if (!original.cerrado) throw new Error('Los ajustes se reservan para movimientos cerrados.');
  if (!['DEBITO', 'CREDITO'].includes(request.direccion) || !Number.isFinite(request.importe) || request.importe <= 0 || !request.concepto.trim()) throw new Error('Complete la dirección, el importe positivo y el concepto del ajuste.');
  const item: MovimientoResponse = { id: nextId, cuentaId: original.cuentaId, tipo: 'AJUSTE', importe: request.importe, fechaOperativa: today(), concepto: request.concepto.trim(), usuario: 'supervisor.demo', registradoEn: new Date().toISOString(), cerrado: false, saldoResultante: 0, movimientoOriginalId: id };
  const balances = movements.filter(movement => movement.cuentaId === original.cuentaId);
  const current = balances.at(-1)?.saldoResultante ?? openingBalances[original.cuentaId] ?? 0;
  const result = Math.round((current + (request.direccion === 'DEBITO' ? -request.importe : request.importe)) * 100) / 100;
  if (result < 0) throw new Error('El ajuste no puede dejar la cuenta con saldo negativo.');
  item.saldoResultante = result;
  movements = sorted([...movements, item]);
  nextId++;
  return { ...item };
}
