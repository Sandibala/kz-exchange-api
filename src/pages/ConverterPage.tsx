
import { useState } from 'react';
import { convertCurrency } from '../api/exchangeApi';
import type { ConversionResponse } from '../types/exchange';

interface ConverterPageProps {
  currencies: string[];
}

function ConverterPage({ currencies }: ConverterPageProps) {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KZT');
  const [amount, setAmount] = useState('100');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA')
  );

  const [result, setResult] =
    useState<ConversionResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableCurrencies = Array.from(
    new Set(['KZT', 'USD', ...currencies])
  );

  async function handleConvert() {
    setError('');
    setResult(null);

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Введите корректную сумму больше нуля');
      return;
    }

    setLoading(true);

    try {
      const data = await convertCurrency(
        from,
        to,
        numericAmount,
        date
      );

      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось выполнить конвертацию');
    } finally {
      setLoading(false);
    }
  }

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
    setResult(null);
    setError('');
  }

  return (
    <section id="converter" className="converter-page">
      <div className="page-heading">
        <h1>Конвертация валют</h1>
        <p>
          Конвертер по курсам Национального Банка РК
        </p>
      </div>

      <div className="converter-card">
        <div className="converter-currencies">
          <div className="form-group">
            <label htmlFor="from-currency">
              Из валюты
            </label>

            <select
              id="from-currency"
              value={from}
              onChange={event => {
                setFrom(event.target.value);
                setResult(null);
              }}
            >
              {availableCurrencies.map(code => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="swap-button"
            onClick={swapCurrencies}
            aria-label="Поменять валюты местами"
          >
            ⇄
          </button>

          <div className="form-group">
            <label htmlFor="to-currency">
              В валюту
            </label>

            <select
              id="to-currency"
              value={to}
              onChange={event => {
                setTo(event.target.value);
                setResult(null);
              }}
            >
              {availableCurrencies.map(code => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            Сумма
          </label>

          <input
            id="amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={event => {
              setAmount(event.target.value);
              setResult(null);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="conversion-date">
            Дата курса
          </label>

          <input
            id="conversion-date"
            type="date"
            value={date}
            onChange={event => {
              setDate(event.target.value);
              setResult(null);
            }}
          />
        </div>

        <button
          type="button"
          className="convert-button"
          onClick={handleConvert}
          disabled={loading}
        >
          {loading
            ? 'Конвертируем...'
            : 'Конвертировать'}
        </button>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {result !== null && (
          <div className="conversion-result">
            <p>Результат конвертации</p>

            <h2>
              {result.amount.toLocaleString('ru-RU')}
              {' '}
              {result.from}
              {' = '}
              {result.convertedAmount.toLocaleString(
                'ru-RU',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                }
              )}
              {' '}
              {result.to}
            </h2>

            <p>
              Дата курса: {result.rateDate}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ConverterPage;
