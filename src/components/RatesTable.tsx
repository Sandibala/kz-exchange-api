
import type { ExchangeRate } from '../types/exchange';

interface RatesTableProps {
  rates: ExchangeRate[];
  previousRates: ExchangeRate[];
  loading: boolean;
  error: string;
}

const currencyInfo: Record<string, {
  flag: string;
  name: string;
}> = {
  USD: { flag: '🇺🇸', name: 'Доллар США' },
  EUR: { flag: '🇪🇺', name: 'Евро' },
  RUB: { flag: '🇷🇺', name: 'Российский рубль' },
  GBP: { flag: '🇬🇧', name: 'Фунт стерлингов' },
  CNY: { flag: '🇨🇳', name: 'Китайский юань' },
  JPY: { flag: '🇯🇵', name: 'Японская иена' },
  CHF: { flag: '🇨🇭', name: 'Швейцарский франк' },
  TRY: { flag: '🇹🇷', name: 'Турецкая лира' },
  KGS: { flag: '🇰🇬', name: 'Кыргызский сом' },
  UZS: { flag: '🇺🇿', name: 'Узбекский сум' },
};

function RatesTable({
  rates,
  previousRates,
  loading,
  error,
}: RatesTableProps) {
  const previousRatesMap = new Map(
    previousRates.map(rate => [rate.currencyCode, rate])
  );

  function formatNumber(value: number): string {
    return value.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }

  function calculateChange(rate: ExchangeRate) {
    const previous = previousRatesMap.get(rate.currencyCode);

    if (
      !previous ||
      rate.quantity <= 0 ||
      previous.quantity <= 0 ||
      previous.rate <= 0
    ) {
      return null;
    }

    const current = rate.rate / rate.quantity;
    const old = previous.rate / previous.quantity;

    return {
      difference: current - old,
      percentage: ((current - old) / old) * 100,
    };
  }

  if (loading) {
    return <p className="table-message">Загрузка курсов...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="table-container">
      <table className="rates-table">
        <thead>
          <tr>
            <th>Валюта</th>
            <th>Количество</th>
            <th>Курс (KZT)</th>
            <th>Изменение</th>
          </tr>
        </thead>

        <tbody>
          {rates.map(rate => {
            const info = currencyInfo[rate.currencyCode];
            const change = calculateChange(rate);

            return (
              <tr key={`${rate.currencyCode}-${rate.rateDate}`}>
                <td>
                  <div className="currency-cell">
                    <span className="currency-flag">
                      {info?.flag ?? '🌐'}
                    </span>
                    <strong>{rate.currencyCode}</strong>
                    <span className="currency-dash">—</span>
                    <span>{info?.name ?? rate.currencyCode}</span>
                  </div>
                </td>

                <td>{rate.quantity}</td>

                <td className="rate-value">
                  {formatNumber(rate.rate)}
                </td>

                <td>
                  {change === null ? (
                    <span className="no-change">—</span>
                  ) : (
                    <span
                      className={
                        change.difference > 0
                          ? 'change-positive'
                          : change.difference < 0
                            ? 'change-negative'
                            : 'no-change'
                      }
                    >
                      {change.difference > 0
                        ? '▲ +'
                        : change.difference < 0
                          ? '▼ '
                          : ''}
                      {formatNumber(change.difference)}
                      {' ('}
                      {change.percentage > 0 ? '+' : ''}
                      {change.percentage.toFixed(2)}%
                      {')'}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rates.length === 0 && (
        <p className="table-message">
          На выбранную дату курсы не найдены.
        </p>
      )}
    </div>
  );
}

export default RatesTable;
