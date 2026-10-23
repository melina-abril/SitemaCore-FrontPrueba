export type MovementType = 'DEBITO' | 'CREDITO' | 'AJUSTE';

export interface MovementRequest {
  cuentaId: number;
  tipo: MovementType;
  importe: number;
  fechaOperativa: string;
  concepto: string;
}

export interface AdjustmentRequest {
  direccion: MovementType;
  importe: number;
  concepto: string;
}

export interface MovementResponse {
  id: number;
  cuentaId: number;
  tipo: MovementType;
  direccion: MovementType;
  importe: number;
  fechaOperativa: string;
  concepto: string;
  usuario: string;
  fechaHora: string;
  cerrado: boolean;
  movimientoOriginalId: number | null;
  saldoResultante: number;
}

export interface MovementSearchResponse {
  movimientos: MovementResponse[];
  saldoResultante: number;
}

export interface MovementDeletionResponse {
  id: number;
  estado: string;
  usuario: string;
  fechaHora: string;
  saldoResultante: number;
}

export interface MovementFilters {
  cuentaId?: number;
  desde?: string;
  hasta?: string;
}
