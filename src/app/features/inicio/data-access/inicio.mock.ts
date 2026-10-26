import type { ResumenDia } from '../models/inicio.models';

export function createInicioMock(nombreUsuario: string, rol: 'OPERADOR' | 'SUPERVISOR'): ResumenDia {
  const today = new Date();
  const fechaOperativa = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  return {
    nombreUsuario,
    rol,
    fechaOperativa,
    cantidadMovimientos: 47,
    estadoCierre: 'PENDIENTE'
  };
}
