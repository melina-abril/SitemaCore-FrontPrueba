import { AccountDetail } from '../models/account.models';

// Datos de demostración; se reemplazan al conectar el backend.
export const MOCK_ACCOUNT_DETAILS: AccountDetail[] = [
  {
    id: 1001,
    clienteId: 101,
    numero: '001-00012345-6',
    tipo: 'CORRIENTE',
    moneda: 'ARS',
    saldo: 125000,
    estado: 'ACTIVA',
    ultimosMovimientos: [
      { id: 5012, fecha: '2026-06-17', tipo: 'DEBITO', concepto: 'Pago a proveedor', importe: 25000, saldoResultante: 125000 },
      { id: 5011, fecha: '2026-06-16', tipo: 'CREDITO', concepto: 'Transferencia recibida', importe: 150000, saldoResultante: 150000 }
    ]
  },
  {
    id: 1002,
    clienteId: 101,
    numero: '001-00012346-4',
    tipo: 'AHORRO',
    moneda: 'USD',
    saldo: 0,
    estado: 'ACTIVA',
    ultimosMovimientos: []
  }
];
