export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export interface ClientRequest {
  document: string;
  name: string;
  email: string;
  phone: string;
}

export interface ClientResponse {
  id: number;
  customerNumber: string;
  document: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
}
