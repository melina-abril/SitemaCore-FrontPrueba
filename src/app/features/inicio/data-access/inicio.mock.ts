import { ResumenDia } from '../models/inicio.models';

/** El mock se reemplaza al conectar el backend. No usa la fecha ni las cifras de la maqueta. */
export function createResumenDiaMock(nombre: string, rol: ResumenDia['rol']): ResumenDia {
  const now = new Date();
  const fechaOperativa = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    nombre,
    rol,
    fechaOperativa,
    cantidadMovimientos: 148,
    estadoCierre: 'PENDIENTE',
  };
}
