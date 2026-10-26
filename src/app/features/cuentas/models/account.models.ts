export type AccountType = 'CORRIENTE' | 'AHORRO';
export type AccountCurrency = 'ARS' | 'USD';
export type AccountStatus = 'ACTIVA' | 'CERRADA';

export interface AccountOpenRequest {
  clienteId: number;
  tipo: AccountType;
  moneda: AccountCurrency;
}

export interface AccountSummary {
  id: number;
  clienteId: number;
  numero: string;
  tipo: AccountType;
  moneda: AccountCurrency;
  saldo: number;
  estado: AccountStatus;
}

export interface RecentMovement {
  id: number;
  fecha: string;
  tipo: string;
  concepto: string;
  importe: number;
  saldoResultante: number;
}

export interface AccountDetail extends AccountSummary {
  ultimosMovimientos: RecentMovement[];
}
