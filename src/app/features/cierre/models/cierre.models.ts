export type EstadoCierre = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CON_ERROR';

export interface CierreDto {
  fechaOperativa: string;
  estado: EstadoCierre;
  cantidadMovimientos: number;
  totalDebitos: number;
  totalCreditos: number;
  saldosCierre: Record<string, number>;
  motivoError: string | null;
  cerradoEn: string | null;
}
