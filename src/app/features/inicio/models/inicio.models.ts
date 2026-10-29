/** Respuesta de GET /api/inicio/resumen, equivalente a ResumenDiaDto. */
export interface ResumenDia {
  nombre: string;
  rol: 'OPERADOR' | 'SUPERVISOR';
  fechaOperativa: string;
  cantidadMovimientos: number;
  estadoCierre: EstadoCierre;
}

export type EstadoCierre = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

export interface AccesoDirecto {
  label: string;
  description: string;
  route: string;
  icon: 'clientes' | 'cuentas' | 'movimientos' | 'cierre';
  soloSupervisor: boolean;
}
