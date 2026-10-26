import type { DailySummary } from '../models/inicio.models';

export function mockDailySummary(userName: string, role: string): DailySummary {
  const operationalDate = new Date().toLocaleDateString('en-CA');

  // Respuesta mock: se reemplaza al conectar el backend.
  return {
    userName,
    role,
    operationalDate,
    movementCount: 18,
    closureStatus: 'PENDIENTE',
    accesses: [
      { name: 'Clientes', path: '/clientes' },
      { name: 'Cuentas', path: '/cuentas' },
      { name: 'Movimientos', path: '/movimientos' },
      ...(role === 'SUPERVISOR'
        ? [{ name: 'Cierre diario', path: '/cierre' }]
        : [])
    ]
  };
}
