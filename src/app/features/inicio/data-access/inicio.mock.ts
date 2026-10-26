import { ResumenDiaDto } from '../models/inicio.models';

export function mockResumenDia(nombreUsuario: string, rol: string): ResumenDiaDto {
  // Respuesta mock a reemplazar al conectar el backend.
  return {
    nombreUsuario,
    rol,
    fechaOperativa: '2026-07-17',
    cantidadMovimientos: 42,
    estadoCierre: 'PENDIENTE'
  };
}
