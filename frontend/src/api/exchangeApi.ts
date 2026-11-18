
import type {
  ExchangeRate,
  Currency,
  ConversionResponse,
  SyncLog,
} from '../types/exchange';

const API_BASE = '/api/v1';

// 1. Получение курсов валют на выбранную дату
export async function getRates(
  date: string
): Promise<ExchangeRate[]> {
  const params = new URLSearchParams({ date });

  const response = await fetch(
    `${API_BASE}/rates?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Ошибка загрузки курсов: ${response.status}`);
  }

  return response.json();
}

// 2. История курса выбранной валюты
export async function getRateHistory(
  currencyCode: string
): Promise<ExchangeRate[]> {
  const response = await fetch(
    `${API_BASE}/rates/${encodeURIComponent(currencyCode)}/history`
  );

  if (!response.ok) {
    throw new Error(`Ошибка загрузки истории: ${response.status}`);
  }

  return response.json();
}

// 3. Конвертация валют
export async function convertCurrency(
  from: string,
  to: string,
  amount: number,
  date: string
): Promise<ConversionResponse> {
  const params = new URLSearchParams({
    from,
    to,
    amount: String(amount),
    date,
  });

  const response = await fetch(
    `${API_BASE}/convert?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Ошибка конвертации: ${response.status}`);
  }

  return response.json();
}

// 4. Получение списка валют
export async function getCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${API_BASE}/currencies`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки валют: ${response.status}`);
  }

  return response.json();
}

// 5. Получение журнала синхронизаций
export async function getSyncLogs(): Promise<SyncLog[]> {
  const response = await fetch(`${API_BASE}/sync-logs`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки журнала: ${response.status}`);
  }

  return response.json();
}

// 6. Синхронизация с Национальным Банком РК
export async function syncRates(): Promise<unknown> {
  const response = await fetch(`${API_BASE}/rates/sync`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Ошибка синхронизации: ${response.status}`);
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}
