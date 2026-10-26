import { AjusteRequest, BajaMovimientoResponse, ConsultaMovimientosResponse, MovimientoFilters, MovimientoRequest, MovimientoResponse, TipoMovimiento } from '../models/movimientos.models';

const operationalDate = '2026-06-15';
const recordedAt = '2026-06-15T10:30:00-03:00';
let nextId = 5;
const directions = new Map<number, TipoMovimiento>();
const movements: MovimientoResponse[] = [
  { id: 1, cuentaId: 101, tipo: 'CREDITO', importe: 1000, fechaOperativa: '2026-06-14', concepto: 'Depósito inicial', usuario: 'María Fernández', registradoEn: '2026-06-14T09:00:00-03:00', cerrado: true, saldoResultante: 1000, movimientoOriginalId: null },
  { id: 2, cuentaId: 101, tipo: 'DEBITO', importe: 150, fechaOperativa: '2026-06-14', concepto: 'Pago de servicio', usuario: 'María Fernández', registradoEn: '2026-06-14T11:15:00-03:00', cerrado: true, saldoResultante: 850, movimientoOriginalId: null },
  { id: 3, cuentaId: 101, tipo: 'CREDITO', importe: 200, fechaOperativa: operationalDate, concepto: 'Transferencia recibida', usuario: 'María Fernández', registradoEn: recordedAt, cerrado: false, saldoResultante: 1050, movimientoOriginalId: null },
  { id: 4, cuentaId: 102, tipo: 'CREDITO', importe: 300, fechaOperativa: operationalDate, concepto: 'Depósito en cuenta', usuario: 'María Fernández', registradoEn: recordedAt, cerrado: false, saldoResultante: 300, movimientoOriginalId: null }
];

function copy(movement: MovimientoResponse): MovimientoResponse {
  return { ...movement };
}

function direction(movement: MovimientoResponse): TipoMovimiento {
  return movement.tipo === 'AJUSTE' ? (directions.get(movement.id) ?? 'CREDITO') : movement.tipo;
}

function balance(cuentaId: number, excludingId?: number): number {
  return movements.filter(item => item.cuentaId === cuentaId && item.id !== excludingId)
    .reduce((total, item) => total + (direction(item) === 'DEBITO' ? -item.importe : item.importe), 0);
}

function recalculate(): void {
  const balances = new Map<number, number>();
  for (const item of movements) {
    const value = (balances.get(item.cuentaId) ?? 0) + (direction(item) === 'DEBITO' ? -item.importe : item.importe);
    balances.set(item.cuentaId, value);
    item.saldoResultante = value;
  }
}

function validateAmount(importe: number): void {
  if (!Number.isFinite(importe) || importe <= 0) throw new Error('El importe debe ser mayor que cero.');
}

function find(id: number): MovimientoResponse {
  const movement = movements.find(item => item.id === id);
  if (!movement) throw new Error('No se encontró el movimiento.');
  return movement;
}

export function mockConsultarMovimientos(filters: MovimientoFilters): ConsultaMovimientosResponse {
  const filtered = movements.filter(item =>
    (filters.cuentaId === undefined || item.cuentaId === filters.cuentaId) &&
    (!filters.desde || item.fechaOperativa >= filters.desde) &&
    (!filters.hasta || item.fechaOperativa <= filters.hasta));
  return { movimientos: filtered.map(copy), saldoResultante: filters.cuentaId === undefined ? 0 : balance(filters.cuentaId) };
}

export function mockRegistrarMovimiento(request: MovimientoRequest, usuario: string): MovimientoResponse {
  validateAmount(request.importe);
  if (!Number.isInteger(request.cuentaId) || request.cuentaId <= 0) throw new Error('Indique una cuenta válida.');
  if (request.tipo !== 'DEBITO' && request.tipo !== 'CREDITO') throw new Error('Seleccione débito o crédito.');
  if (!request.concepto.trim()) throw new Error('El concepto es obligatorio.');
  if (request.fechaOperativa < operationalDate) throw new Error('No se aceptan movimientos de días cerrados.');
  if (request.tipo === 'DEBITO' && balance(request.cuentaId) < request.importe) throw new Error('El débito dejaría la cuenta con saldo negativo.');
  const movement: MovimientoResponse = { id: nextId++, ...request, concepto: request.concepto.trim(), usuario, registradoEn: recordedAt, cerrado: false, saldoResultante: 0, movimientoOriginalId: null };
  movements.push(movement);
  recalculate();
  return copy(movement);
}

export function mockModificarMovimiento(id: number, request: MovimientoRequest, usuario: string): MovimientoResponse {
  const existing = find(id);
  if (existing.cerrado) throw new Error('Un movimiento cerrado solo se corrige mediante un ajuste.');
  validateAmount(request.importe);
  if (!Number.isInteger(request.cuentaId) || request.cuentaId <= 0 || !request.concepto.trim() || (request.tipo !== 'DEBITO' && request.tipo !== 'CREDITO')) throw new Error('Revise los datos del movimiento.');
  if (request.fechaOperativa < operationalDate) throw new Error('No se aceptan movimientos de días cerrados.');
  if (request.tipo === 'DEBITO' && balance(request.cuentaId, id) < request.importe) throw new Error('El débito dejaría la cuenta con saldo negativo.');
  Object.assign(existing, request, { concepto: request.concepto.trim(), usuario, registradoEn: recordedAt });
  recalculate();
  return copy(existing);
}

export function mockEliminarMovimiento(id: number, usuario: string): BajaMovimientoResponse {
  const existing = find(id);
  if (existing.cerrado) throw new Error('No se puede dar de baja un movimiento cerrado.');
  movements.splice(movements.indexOf(existing), 1);
  directions.delete(id);
  recalculate();
  return { id, estado: 'BAJA', usuario, registradoEn: recordedAt };
}

export function mockAjustarMovimiento(id: number, request: AjusteRequest, usuario: string): MovimientoResponse {
  const original = find(id);
  if (!original.cerrado) throw new Error('Los ajustes se utilizan para corregir movimientos cerrados.');
  validateAmount(request.importe);
  if (!request.concepto.trim() || (request.direccion !== 'DEBITO' && request.direccion !== 'CREDITO')) throw new Error('Revise la dirección y el concepto del ajuste.');
  if (request.direccion === 'DEBITO' && balance(original.cuentaId) < request.importe) throw new Error('El ajuste dejaría la cuenta con saldo negativo.');
  const adjustment: MovimientoResponse = { id: nextId++, cuentaId: original.cuentaId, tipo: 'AJUSTE', importe: request.importe, fechaOperativa: operationalDate, concepto: request.concepto.trim(), usuario, registradoEn: recordedAt, cerrado: false, saldoResultante: 0, movimientoOriginalId: id };
  directions.set(adjustment.id, request.direccion);
  movements.push(adjustment);
  recalculate();
  return copy(adjustment);
}
