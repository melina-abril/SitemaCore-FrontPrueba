import { AdjustmentRequest, MovementDeletionResponse, MovementFilters, MovementRequest, MovementResponse, MovementSearchResponse } from '../models/movimientos.models';

const operationalDate = '2026-04-14';
const timestamp = '2026-04-14T10:30:00';

// Datos dummy en memoria: reemplazar por las respuestas del backend al conectarlo.
let movements: MovementResponse[] = [
  { id: 1, cuentaId: 101, tipo: 'CREDITO', direccion: 'CREDITO', importe: 1500, fechaOperativa: '2026-04-13', concepto: 'Depósito inicial', usuario: 'operador.demo', fechaHora: '2026-04-13T09:15:00', cerrado: true, movimientoOriginalId: null, saldoResultante: 1500 },
  { id: 2, cuentaId: 101, tipo: 'DEBITO', direccion: 'DEBITO', importe: 250, fechaOperativa: '2026-04-13', concepto: 'Pago de servicios', usuario: 'operador.demo', fechaHora: '2026-04-13T11:20:00', cerrado: true, movimientoOriginalId: null, saldoResultante: 1250 },
  { id: 3, cuentaId: 101, tipo: 'CREDITO', direccion: 'CREDITO', importe: 100, fechaOperativa: operationalDate, concepto: 'Transferencia recibida', usuario: 'operador.demo', fechaHora: '2026-04-14T09:10:00', cerrado: false, movimientoOriginalId: null, saldoResultante: 1350 },
  { id: 4, cuentaId: 102, tipo: 'CREDITO', direccion: 'CREDITO', importe: 320, fechaOperativa: operationalDate, concepto: 'Depósito en cuenta', usuario: 'operador.demo', fechaHora: '2026-04-14T09:35:00', cerrado: false, movimientoOriginalId: null, saldoResultante: 320 }
];

function recalculate(): void {
  const balances = new Map<number, number>();
  movements = movements.map(movement => {
    const change = movement.direccion === 'CREDITO' ? movement.importe : -movement.importe;
    const balance = (balances.get(movement.cuentaId) ?? 0) + change;
    balances.set(movement.cuentaId, balance);
    return { ...movement, saldoResultante: balance };
  });
}

function accountBalance(accountId: number): number {
  return movements.filter(movement => movement.cuentaId === accountId).at(-1)?.saldoResultante ?? 0;
}

function requireOpen(id: number): MovementResponse {
  const movement = movements.find(item => item.id === id);
  if (!movement) throw new Error('No se encontró el movimiento.');
  if (movement.cerrado || movement.tipo === 'AJUSTE') throw new Error('Un movimiento cerrado no se puede modificar ni eliminar. Se corrige con un ajuste.');
  return movement;
}

function validateRequest(request: MovementRequest, previous?: MovementResponse): void {
  if (!Number.isSafeInteger(request.cuentaId) || request.cuentaId <= 0) throw new Error('Ingrese una cuenta válida.');
  if (request.tipo !== 'DEBITO' && request.tipo !== 'CREDITO') throw new Error('Seleccione débito o crédito.');
  if (!Number.isFinite(request.importe) || request.importe <= 0) throw new Error('El importe debe ser mayor que cero.');
  if (!request.concepto.trim() || !request.fechaOperativa) throw new Error('Complete la fecha y el concepto.');
  if (request.fechaOperativa !== operationalDate) throw new Error('La fecha operativa indicada ya está cerrada o no está vigente.');
  const available = accountBalance(request.cuentaId) + (previous?.cuentaId === request.cuentaId ? (previous.direccion === 'CREDITO' ? -previous.importe : previous.importe) : 0);
  if (request.tipo === 'DEBITO' && available < request.importe) throw new Error('El débito no puede dejar la cuenta con saldo negativo.');
}

export function mockSearchMovements(filters: MovementFilters): MovementSearchResponse {
  const selected = movements.filter(item =>
    (filters.cuentaId === undefined || item.cuentaId === filters.cuentaId) &&
    (!filters.desde || item.fechaOperativa >= filters.desde) &&
    (!filters.hasta || item.fechaOperativa <= filters.hasta)
  );
  return { movimientos: selected.map(item => ({ ...item })), saldoResultante: selected.at(-1)?.saldoResultante ?? 0 };
}

export function mockCreateMovement(request: MovementRequest): MovementResponse {
  validateRequest(request);
  const movement: MovementResponse = { ...request, id: Math.max(0, ...movements.map(item => item.id)) + 1, direccion: request.tipo, concepto: request.concepto.trim(), usuario: 'operador.demo', fechaHora: timestamp, cerrado: false, movimientoOriginalId: null, saldoResultante: 0 };
  movements = [...movements, movement];
  recalculate();
  return { ...movements.at(-1)! };
}

export function mockUpdateOpenMovement(id: number, request: MovementRequest): MovementResponse {
  const original = requireOpen(id);
  validateRequest(request, original);
  movements = movements.map(item => item.id === id ? { ...item, ...request, concepto: request.concepto.trim(), direccion: request.tipo, usuario: 'operador.demo', fechaHora: timestamp } : item);
  recalculate();
  return { ...movements.find(item => item.id === id)! };
}

export function mockDeleteOpenMovement(id: number): MovementDeletionResponse {
  const original = requireOpen(id);
  movements = movements.filter(item => item.id !== id);
  recalculate();
  return { id, estado: 'ELIMINADO', usuario: 'operador.demo', fechaHora: timestamp, saldoResultante: accountBalance(original.cuentaId) };
}

export function mockCreateAdjustment(id: number, request: AdjustmentRequest): MovementResponse {
  const original = movements.find(item => item.id === id);
  if (!original) throw new Error('No se encontró el movimiento original.');
  if (!original.cerrado) throw new Error('Solo se ajustan movimientos de días cerrados.');
  if (request.direccion !== 'CREDITO' && request.direccion !== 'DEBITO') throw new Error('Seleccione la dirección del ajuste.');
  if (!Number.isFinite(request.importe) || request.importe <= 0 || !request.concepto.trim()) throw new Error('Ingrese un importe positivo y un concepto.');
  if (request.direccion === 'DEBITO' && accountBalance(original.cuentaId) < request.importe) throw new Error('El ajuste no puede dejar la cuenta con saldo negativo.');
  const adjustment: MovementResponse = { id: Math.max(...movements.map(item => item.id)) + 1, cuentaId: original.cuentaId, tipo: 'AJUSTE', direccion: request.direccion, importe: request.importe, fechaOperativa: operationalDate, concepto: request.concepto.trim(), usuario: 'supervisor.demo', fechaHora: timestamp, cerrado: false, movimientoOriginalId: id, saldoResultante: 0 };
  movements = [...movements, adjustment];
  recalculate();
  return { ...movements.at(-1)! };
}
