
import { useCallback, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import StatsCards from './components/StatsCards';
import RatesTable from './components/RatesTable';

import ConverterPage from './pages/ConverterPage';
import HistoryPage from './pages/HistoryPage';
import SyncPage from './pages/SyncPage';

import {
  getCurrencies,
  getRates,
  getSyncLogs,
} from './api/exchangeApi';

import type {
  ExchangeRate,
  SyncLog,
} from './types/exchange';

import './App.css';

function getToday() {
  const now = new Date();

  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 10);
}

function App() {
  const [selectedDate, setSelectedDate] = useState(getToday);

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRates = useCallback(async (date: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await getRates(date);
      setRates(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить курсы валют');
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMetadata = useCallback(async () => {
    const results = await Promise.allSettled([
      getCurrencies(),
      getSyncLogs(),
    ]);

    if (results[0].status === 'fulfilled') {
      setCurrencies(results[0].value.map(item => item.code));
    } else {
      console.error(results[0].reason);
    }

    if (results[1].status === 'fulfilled') {
      setLogs(results[1].value);
    } else {
      console.error(results[1].reason);
    }
  }, []);

  useEffect(() => {
    void loadRates(selectedDate);
  }, [selectedDate, loadRates]);

  useEffect(() => {
    void loadMetadata();
  }, [loadMetadata]);

  async function handleSyncSuccess() {
    await Promise.all([
      loadRates(selectedDate),
      loadMetadata(),
    ]);
  }

  const lastSync = [...logs]
    .filter(log => log.status === 'SUCCESS')
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];

  const lastSyncDate = lastSync
    ? lastSync.finishedAt ?? lastSync.startedAt
    : null;

  const currencyCodes = currencies.length > 0
    ? currencies
    : rates.map(rate => rate.currencyCode);

  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/rates" replace />}
          />

          <Route
            path="/rates"
            element={
              <>
                <HeroBanner />

                <div className="dashboard-container">
                  <section className="dashboard-section">
                    <div className="section-heading">
                      <div>
                        <span className="section-eyebrow">
                          ОБЗОР РЫНКА
                        </span>

                        <h1>Курсы валют</h1>

                        <p>
                          Официальные курсы Национального
                          Банка Республики Казахстан
                        </p>
                      </div>

                      <div className="rates-controls">
                        <label htmlFor="rates-date">
                          Дата курса
                        </label>

                        <input
                          id="rates-date"
                          type="date"
                          value={selectedDate}
                          onChange={event =>
                            setSelectedDate(event.target.value)
                          }
                        />

                        <button
                          type="button"
                          className="primary-button"
                          disabled={loading}
                          onClick={() =>
                            void loadRates(selectedDate)
                          }
                        >
                          {loading ? 'Загрузка...' : '↻ Обновить'}
                        </button>
                      </div>
                    </div>

                    <StatsCards
                      currencyCount={rates.length}
                      lastSyncDate={lastSyncDate}
                    />

                    <div className="rates-panel">
                      <div className="panel-heading">
                        <div>
                          <h2>Актуальные курсы</h2>
                          <p>
                            Курсы по отношению к тенге (KZT)
                          </p>
                        </div>

                        <span className="date-pill">
                          {selectedDate}
                        </span>
                      </div>

                      <div className="rates-scroll">
                        <RatesTable
                          rates={rates}
                          previousRates={[]}
                          loading={loading}
                          error={error}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </>
            }
          />

          <Route
            path="/converter"
            element={
              <div className="dashboard-container">
                <ConverterPage currencies={currencyCodes} />
              </div>
            }
          />

          <Route
            path="/history"
            element={
              <div className="dashboard-container">
                <HistoryPage currencies={currencyCodes} />
              </div>
            }
          />

          <Route
            path="/sync"
            element={
              <div className="dashboard-container">
                <SyncPage onSyncSuccess={handleSyncSuccess} />
              </div>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/rates" replace />}
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>₸ KZ Exchange</strong>
            <p>
              Удобный сервис для просмотра курсов валют,
              конвертации и анализа истории изменений.
            </p>
          </div>

          <div className="footer-source">
            <span>Источник данных</span>
            <strong>Национальный Банк РК</strong>
          </div>

          <div className="footer-copyright">
            © 2026 KZ Exchange
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
