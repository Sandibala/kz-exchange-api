-- 1. Справочник валют
CREATE TABLE currencies (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- 2. Переносим существующие коды валют
INSERT INTO currencies (code, name)
SELECT DISTINCT currency_code, currency_code
FROM exchange_rates;

-- 3. Добавляем связь с валютой
ALTER TABLE exchange_rates
ADD COLUMN currency_id BIGINT;

UPDATE exchange_rates er
SET currency_id = c.id
FROM currencies c
WHERE er.currency_code = c.code;

ALTER TABLE exchange_rates
ALTER COLUMN currency_id SET NOT NULL;

ALTER TABLE exchange_rates
ADD CONSTRAINT fk_exchange_rates_currency
FOREIGN KEY (currency_id)
REFERENCES currencies(id);

-- 4. Удаляем старое ограничение уникальности
ALTER TABLE exchange_rates
DROP CONSTRAINT uk_currency_date;

-- 5. Создаём новое ограничение
ALTER TABLE exchange_rates
ADD CONSTRAINT uk_currency_id_date
UNIQUE (currency_id, rate_date);

-- 6. Удаляем старую колонку
ALTER TABLE exchange_rates
DROP COLUMN currency_code;

-- 7. История синхронизаций
CREATE TABLE exchange_rate_sync_logs (
    id BIGSERIAL PRIMARY KEY,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    records_processed INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    CONSTRAINT chk_sync_status
        CHECK (status IN ('SUCCESS', 'FAILED'))
);
