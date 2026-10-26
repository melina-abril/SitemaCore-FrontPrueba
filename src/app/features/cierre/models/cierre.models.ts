export type ClosingStatus = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CON_ERROR';

export interface DailyClosing {
  fechaOperativa: string;
  estado: ClosingStatus;
  cantidadMovimientos: number;
  totalDebitos: number | null;
  totalCreditos: number | null;
  saldosCierre: Record<string, number>;
  motivoError: string | null;
  cerradoEn: string | null;
}
