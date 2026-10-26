import type { DailyClosing } from '../models/cierre.models';

// Datos mock temporales: reemplazar al conectar el backend.
export const MOCK_DAILY_CLOSING: DailyClosing = {
  fechaOperativa: '2026-06-11',
  estado: 'PENDIENTE',
  cantidadMovimientos: 18,
  totalDebitos: null,
  totalCreditos: null,
  saldosCierre: {},
  motivoError: null,
  cerradoEn: null
};

export const MOCK_COMPLETED_CLOSING: DailyClosing = {
  fechaOperativa: '2026-06-11',
  estado: 'COMPLETADO',
  cantidadMovimientos: 18,
  totalDebitos: 4250.75,
  totalCreditos: 6890.25,
  saldosCierre: {
    'Cuenta 0001-2458': 12450.5,
    'Cuenta 0001-3821': 8720.25
  },
  motivoError: null,
  cerradoEn: '2026-06-11T21:05:00Z'
};

export const MOCK_CLOSING_HISTORY: DailyClosing[] = [
  {
    fechaOperativa: '2026-06-10',
    estado: 'COMPLETADO',
    cantidadMovimientos: 24,
    totalDebitos: 5230.5,
    totalCreditos: 7480.75,
    saldosCierre: { 'Cuenta 0001-2458': 9811 },
    motivoError: null,
    cerradoEn: '2026-06-10T21:08:00Z'
  },
  {
    fechaOperativa: '2026-06-09',
    estado: 'COMPLETADO',
    cantidadMovimientos: 21,
    totalDebitos: 3180,
    totalCreditos: 4210.25,
    saldosCierre: { 'Cuenta 0001-2458': 7560.75 },
    motivoError: null,
    cerradoEn: '2026-06-09T21:03:00Z'
  }
];
