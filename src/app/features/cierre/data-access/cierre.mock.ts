import { CierreDto } from '../models/cierre.models';

export const mockCierreActual: CierreDto = {
  fechaOperativa: '2026-02-25',
  estado: 'PENDIENTE',
  cantidadMovimientos: 184,
  totalDebitos: 0,
  totalCreditos: 0,
  saldosCierre: {},
  motivoError: null,
  cerradoEn: null
};

export const mockHistorialCierres: CierreDto[] = [
  {
    fechaOperativa: '2026-02-24',
    estado: 'COMPLETADO',
    cantidadMovimientos: 172,
    totalDebitos: 128450.75,
    totalCreditos: 149800.5,
    saldosCierre: { ARS: 2468120.8, USD: 38250 },
    motivoError: null,
    cerradoEn: '2026-02-24T20:15:00Z'
  },
  {
    fechaOperativa: '2026-02-23',
    estado: 'COMPLETADO',
    cantidadMovimientos: 156,
    totalDebitos: 96500,
    totalCreditos: 112340.25,
    saldosCierre: { ARS: 2446771.05, USD: 38250 },
    motivoError: null,
    cerradoEn: '2026-02-23T20:09:00Z'
  }
];
