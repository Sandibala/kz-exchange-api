
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { getRateHistory } from '../api/exchangeApi';
import type { ExchangeRate } from '../types/exchange';

interface HistoryPageProps {
  currencies: string[];
}

function HistoryPage({ currencies }: HistoryPageProps) {
  const [currency, setCurrency] = useState('USD');
  const [history, setHistory] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableCurrencies = Array.from(
    new Set(['USD', ...currencies])
  );

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setLoading(true);
      setError('');
      setHistory([]);

      try {
        const data = await getRateHistory(currency);

        if (!cancelled) {
          setHistory(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError('Не удалось загрузить историю курсов');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [currency]);

  const chartData = history
    .filter(item => item.quantity > 0)
    .map(item => ({
      date: item.rateDate,
      rate: item.rate / item.quantity,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section id="history" className="history-page">
      <div className="page-heading">
        <h1>История курсов валют</h1>
        <p>Динамика курсов Национального Банка РК</p>
      </div>

      <div className="history-card">
        <div className="form-group">
          <label htmlFor="history-currency">
            Выберите валюту
          </label>

          <select
            id="history-currency"
            value={currency}
            onChange={event => setCurrency(event.target.value)}
          >
            {availableCurrencies.map(code => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Загрузка истории...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && chartData.length === 0 && (
          <p>История для выбранной валюты пока отсутствует.</p>
        )}

        {!loading && !error && chartData.length > 0 && (
          <>
            <h2>Курс {currency} к тенге</h2>

            <div className="history-chart">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    domain={['auto', 'auto']}
                    width={75}
                  />
                  <Tooltip
                    formatter={value => [
                      `${Number(value).toFixed(4)} ₸`,
                      'Курс',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#6d4aff"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <h3>Исторические данные</h3>

            <div className="table-container">
              <table className="rates-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Количество</th>
                    <th>Курс (KZT)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history]
                    .sort((a, b) =>
                      b.rateDate.localeCompare(a.rateDate)
                    )
                    .map(item => (
                      <tr key={item.rateDate}>
                        <td>{item.rateDate}</td>
                        <td>{item.quantity}</td>
                        <td>{item.rate}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HistoryPage;
