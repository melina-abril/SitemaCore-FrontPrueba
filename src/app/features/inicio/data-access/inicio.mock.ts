import { SessionUser } from '../../../core/session/current-user';
import { ResumenDiaDto } from '../models/inicio.models';

export function mockResumenDia(user: SessionUser): ResumenDiaDto {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return {
    nombreUsuario: user.name,
    rol: user.role,
    fechaOperativa: `${year}-${month}-${day}`,
    cantidadMovimientos: 18,
    estadoCierre: 'PENDIENTE'
  };
}
