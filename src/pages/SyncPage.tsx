
import { useEffect, useState } from 'react';
import { getSyncLogs, syncRates } from '../api/exchangeApi';
import type { SyncLog } from '../types/exchange';

interface SyncPageProps {
  onSyncSuccess?: () => void | Promise<void>;
}

function SyncPage({ onSyncSuccess }: SyncPageProps) {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadLogs() {
    setLoading(true);

    try {
      const data = await getSyncLogs();

      const sortedLogs = [...data].sort(
        (a, b) => b.startedAt.localeCompare(a.startedAt)
      );

      setLogs(sortedLogs);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить журнал');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLogs();
  }, []);

  async function handleSync() {
    setSyncing(true);
    setError('');
    setMessage('');

    try {
      await syncRates();

      setMessage('Курсы валют успешно обновлены');

      await loadLogs();

      if (onSyncSuccess) {
        await onSyncSuccess();
      }
    } catch (err) {
      console.error(err);
      setError('Ошибка синхронизации');
    } finally {
      setSyncing(false);
    }
  }

  function formatDate(date: string | null) {
    if (!date) return '—';

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleString('ru-RU');
  }

  return (
    <section id="sync" className="sync-page">
      <div className="page-heading">
        <h1>Синхронизация</h1>
        <p>Обновление курсов Национального Банка РК</p>
      </div>

      <div className="sync-card">
        <div className="sync-source">
          <h2>Источник данных</h2>
          <p>🏛️ Национальный Банк Республики Казахстан</p>
        </div>

        <button
          type="button"
          className="sync-button"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing
            ? 'Синхронизация...'
            : '↻ Обновить курсы валют'}
        </button>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>

      <div className="sync-logs-card">
        <div className="sync-logs-header">
          <h2>Журнал синхронизаций</h2>

          <button
            type="button"
            className="refresh-logs-button"
            onClick={() => void loadLogs()}
            disabled={loading || syncing}
          >
            Обновить журнал
          </button>
        </div>

        {loading && <p>Загрузка журнала...</p>}

        {!loading && (
          <div className="table-container">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Начало</th>
                  <th>Завершение</th>
                  <th>Статус</th>
                  <th>Записей</th>
                  <th>Ошибка</th>
                </tr>
              </thead>

              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{formatDate(log.startedAt)}</td>
                    <td>{formatDate(log.finishedAt)}</td>

                    <td>
                      <span
                        className={
                          log.status === 'SUCCESS'
                            ? 'change-positive'
                            : log.status === 'FAILED'
                              ? 'change-negative'
                              : 'no-change'
                        }
                      >
                        {log.status === 'SUCCESS'
                          ? 'Успешно'
                          : log.status === 'FAILED'
                            ? 'Ошибка'
                            : log.status}
                      </span>
                    </td>

                    <td>{log.recordsProcessed}</td>
                    <td>{log.errorMessage ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {logs.length === 0 && (
              <p className="table-message">
                История синхронизаций пока пуста.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default SyncPage;
