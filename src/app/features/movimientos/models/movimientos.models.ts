export type TipoMovimiento = 'DEBITO' | 'CREDITO' | 'AJUSTE';

export interface MovimientoRequest {
  cuentaId: number;
  tipo: TipoMovimiento;
  importe: number;
  fechaOperativa: string;
  concepto: string;
}

export interface AjusteRequest {
  direccion: TipoMovimiento;
  importe: number;
  concepto: string;
}

export interface MovimientoResponse {
  id: number;
  cuentaId: number;
  tipo: TipoMovimiento;
  importe: number;
  fechaOperativa: string;
  concepto: string;
  usuario: string;
  registradoEn: string;
  cerrado: boolean;
  saldoResultante: number;
  movimientoOriginalId: number | null;
}

export interface ConsultaResponse {
  movimientos: MovimientoResponse[];
  saldoResultante: number;
}

export interface BajaResponse {
  id: number;
  estado: string;
  usuario: string;
  registradoEn: string;
}

export interface MovimientoFilters {
  cuentaId?: number;
  desde?: string;
  hasta?: string;
}
