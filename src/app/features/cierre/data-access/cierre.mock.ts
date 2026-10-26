import { DailyClose } from '../models/cierre.models';

// Respuestas mock a reemplazar al conectar el backend.
export const mockDailyClose: DailyClose = {
  fechaOperativa: '2026-06-15',
  cantidadMovimientos: 38,
  estado: 'PENDIENTE',
  totalDebitos: null,
  totalCreditos: null,
  saldosCierre: null,
  motivoError: null
};

export const mockCloseHistory: DailyClose[] = [
  {
    fechaOperativa: '2026-06-12', cantidadMovimientos: 42, estado: 'COMPLETADO',
    totalDebitos: 184500.25, totalCreditos: 201300.50,
    saldosCierre: { 'CTA-1001': 128400.25, 'CTA-1002': 72900 }, motivoError: null
  },
  {
    fechaOperativa: '2026-06-11', cantidadMovimientos: 35, estado: 'COMPLETADO',
    totalDebitos: 153200, totalCreditos: 167850,
    saldosCierre: { 'CTA-1001': 117250, 'CTA-1002': 67250 }, motivoError: null
  }
];
