import { AjusteRequest, BajaMovimientoResponse, ConsultaMovimientosResponse, MovimientoFilters, MovimientoRequest, MovimientoResponse } from '../models/movimientos.models';

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
let nextId = 4;
let records: MovimientoResponse[] = [
  { id: 1, cuentaId: 1001, tipo: 'CREDITO', importe: 125000, fechaOperativa: yesterday, concepto: 'Depósito inicial', usuario: 'Lucía Gómez', registradoEn: `${yesterday}T09:15:00Z`, cerrado: true, saldoResultante: 125000, movimientoOriginalId: null },
  { id: 2, cuentaId: 1001, tipo: 'DEBITO', importe: 12500, fechaOperativa: yesterday, concepto: 'Pago de proveedor', usuario: 'Ana Ruiz', registradoEn: `${yesterday}T11:30:00Z`, cerrado: true, saldoResultante: 112500, movimientoOriginalId: null },
  { id: 3, cuentaId: 1001, tipo: 'CREDITO', importe: 18000, fechaOperativa: today, concepto: 'Cobro de factura', usuario: 'Lucía Gómez', registradoEn: `${today}T10:20:00Z`, cerrado: false, saldoResultante: 130500, movimientoOriginalId: null }
];

function recalculate(): void {
  const balances = new Map<number, number>();
  for (const record of records) {
    const previous = balances.get(record.cuentaId) ?? 0;
    const amount = record.tipo === 'DEBITO' ? -record.importe : record.importe;
    record.saldoResultante = previous + amount;
    balances.set(record.cuentaId, record.saldoResultante);
  }
}

function validate(request: MovimientoRequest, excludedId?: number): void {
  if (!Number.isSafeInteger(request.cuentaId) || request.cuentaId <= 0 || !Number.isFinite(request.importe) || request.importe <= 0 || !request.concepto.trim()) {
    throw new Error('Completá una cuenta válida, un importe mayor que cero y un concepto.');
  }
  if (request.tipo === 'AJUSTE') throw new Error('Los ajustes se registran desde la opción de supervisión.');
  if (request.fechaOperativa !== today) throw new Error('Solo se admiten movimientos de la fecha operativa abierta.');
  const balance = records.filter((item) => item.cuentaId === request.cuentaId && item.id !== excludedId).reduce((sum, item) => sum + (item.tipo === 'DEBITO' ? -item.importe : item.importe), 0);
  if (request.tipo === 'DEBITO' && balance < request.importe) throw new Error('El débito no puede dejar la cuenta con saldo negativo.');
}

// Datos mock temporales: reemplazar al conectar el backend.
export function mockConsultarMovimientos(filters: MovimientoFilters): ConsultaMovimientosResponse {
  const matches = records.filter((item) => (filters.cuentaId === undefined || item.cuentaId === filters.cuentaId) && (!filters.desde || item.fechaOperativa >= filters.desde) && (!filters.hasta || item.fechaOperativa <= filters.hasta));
  return { movimientos: matches.map((item) => ({ ...item })), saldoResultante: matches.at(-1)?.saldoResultante ?? 0 };
}

export function mockRegistrarMovimiento(request: MovimientoRequest, usuario: string): MovimientoResponse {
  validate(request);
  const record: MovimientoResponse = { ...request, id: nextId++, concepto: request.concepto.trim(), usuario, registradoEn: new Date().toISOString(), cerrado: false, saldoResultante: 0, movimientoOriginalId: null };
  records = [...records, record];
  recalculate();
  return { ...record };
}

export function mockModificarMovimiento(id: number, request: MovimientoRequest, usuario: string): MovimientoResponse {
  const index = records.findIndex((item) => item.id === id);
  if (index < 0) throw new Error('No se encontró el movimiento.');
  if (records[index].cerrado) throw new Error('Un movimiento cerrado solo puede corregirse con un ajuste.');
  if (records[index].cuentaId !== request.cuentaId) throw new Error('No se puede cambiar la cuenta de un movimiento.');
  validate(request, id);
  records[index] = { ...records[index], ...request, concepto: request.concepto.trim(), usuario, registradoEn: new Date().toISOString() };
  recalculate();
  return { ...records[index] };
}

export function mockEliminarMovimiento(id: number, usuario: string): BajaMovimientoResponse {
  const record = records.find((item) => item.id === id);
  if (!record) throw new Error('No se encontró el movimiento.');
  if (record.cerrado) throw new Error('Un movimiento cerrado no se puede eliminar.');
  records = records.filter((item) => item.id !== id);
  recalculate();
  return { id, estado: 'ELIMINADO', usuario, registradoEn: new Date().toISOString() };
}

export function mockAjustarMovimiento(id: number, request: AjusteRequest, usuario: string): MovimientoResponse {
  const original = records.find((item) => item.id === id);
  if (!original) throw new Error('No se encontró el movimiento original.');
  if (!original.cerrado) throw new Error('Solo se ajustan movimientos de días cerrados.');
  if (!Number.isFinite(request.importe) || request.importe <= 0 || !request.concepto.trim()) throw new Error('Ingresá un importe mayor que cero y un concepto.');
  if (request.direccion === 'AJUSTE') throw new Error('Seleccioná débito o crédito como dirección del ajuste.');
  const balance = records.filter((item) => item.cuentaId === original.cuentaId).at(-1)?.saldoResultante ?? 0;
  if (request.direccion === 'DEBITO' && request.importe > balance) throw new Error('El ajuste no puede dejar la cuenta con saldo negativo.');
  const record: MovimientoResponse = { id: nextId++, cuentaId: original.cuentaId, tipo: 'AJUSTE', importe: request.importe, fechaOperativa: today, concepto: request.concepto.trim(), usuario, registradoEn: new Date().toISOString(), cerrado: false, saldoResultante: balance + (request.direccion === 'DEBITO' ? -request.importe : request.importe), movimientoOriginalId: original.id };
  records = [...records, record];
  return { ...record };
}
