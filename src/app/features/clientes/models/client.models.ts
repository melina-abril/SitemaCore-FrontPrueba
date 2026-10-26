export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export interface ClientRequest {
  document: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface ClientResponse {
  id: number;
  customerNumber: string;
  document: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
}
