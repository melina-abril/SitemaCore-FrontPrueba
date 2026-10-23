export type CloseStatus = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CON_ERROR';

export interface DailyClose {
  fechaOperativa: string;
  cantidadMovimientos: number;
  estado: CloseStatus;
  totalDebitos: number | null;
  totalCreditos: number | null;
  saldosCierre: Record<string, number> | null;
  motivoError: string | null;
}
