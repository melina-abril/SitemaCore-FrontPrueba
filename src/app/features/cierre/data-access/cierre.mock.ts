import { CierreDto } from '../models/cierre.models';

export const MOCK_CIERRE: CierreDto = {
  fechaOperativa: '2026-07-15',
  estado: 'PENDIENTE',
  cantidadMovimientos: 18,
  totalDebitos: 0,
  totalCreditos: 0,
  saldosCierre: {},
  motivoError: null,
  cerradoEn: null
};

export const MOCK_HISTORIAL: CierreDto[] = [
  {
    fechaOperativa: '2026-07-14', estado: 'COMPLETADO', cantidadMovimientos: 23,
    totalDebitos: 12450.75, totalCreditos: 18600,
    saldosCierre: { 'CTA-1001': 24800.25, 'CTA-1002': 7300 },
    motivoError: null, cerradoEn: '2026-07-14T20:15:00Z'
  },
  {
    fechaOperativa: '2026-07-13', estado: 'COMPLETADO', cantidadMovimientos: 16,
    totalDebitos: 8700, totalCreditos: 10250.50,
    saldosCierre: { 'CTA-1001': 18651, 'CTA-1002': 7300 },
    motivoError: null, cerradoEn: '2026-07-13T20:09:00Z'
  }
];
