export interface DailySummaryAccess {
  name: string;
  path: string;
}

export interface DailySummary {
  userName: string;
  role: string;
  operationalDate: string;
  movementCount: number;
  closureStatus: string;
  accesses: DailySummaryAccess[];
}
