
export interface ExchangeRate {
  currencyCode: string;
  quantity: number;
  rate: number;
  rateDate: string;
}

export interface Currency {
  code: string;
  name: string;
}

export interface ConversionResponse {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rateDate: string;
}

export interface SyncLog {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  recordsProcessed: number;
  errorMessage: string | null;
}
