
interface StatsCardsProps {
  currencyCount: number;
  lastSyncDate: string | null;
}

function StatsCards({
  currencyCount,
  lastSyncDate,
}: StatsCardsProps) {
  function formatDate(date: string | null): string {
    if (!date) return 'Нет данных';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return 'Нет данных';
    }

    return parsed.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">💱</div>
        <div className="stat-info">
          <p>Валют в базе</p>
          <h2>{currencyCount}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🕒</div>
        <div className="stat-info">
          <p>Последняя синхронизация</p>
          <h2>{formatDate(lastSyncDate)}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🏛️</div>
        <div className="stat-info">
          <p>Источник</p>
          <h2>Нацбанк РК</h2>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
