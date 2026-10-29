export type Rol = 'OPERADOR' | 'SUPERVISOR';

/** Contratos de POST /api/auth/login. expiraEn es un Instant serializado como ISO 8601. */
export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  expiraEn: string;
  nombre: string;
  rol: Rol;
}
