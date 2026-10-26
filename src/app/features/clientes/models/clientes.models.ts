export interface ClientRequest {
  name: string;
  document: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface ClientAudit {
  action: string;
  user: string;
  occurredAt: string;
}

export interface ClientResponse {
  id: number;
  number: string;
  name: string;
  document: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  audit: ClientAudit;
}

export interface ClientSearch {
  name?: string;
  document?: string;
  number?: string;
}
