export interface OpenRequest {
  customerId: number;
  type: string;
  currency: string;
}

export interface Account {
  id: number;
  customerId: number;
  number: string;
  type: string;
  currency: string;
  balance: number;
  status: 'OPEN' | 'CLOSED';
}

export interface RecentMovement {
  id: number;
  type: string;
  amount: number;
  date: string;
  concept: string;
  resultingBalance: number;
}

export interface Detail {
  account: Account;
  recentMovements: RecentMovement[];
}
