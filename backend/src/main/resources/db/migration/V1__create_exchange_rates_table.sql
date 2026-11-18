CREATE TABLE exchange_rates (
   id BIGSERIAL PRIMARY KEY,
   currency_code VARCHAR(3) NOT NULL,
   rate NUMERIC(18, 6) NOT NULL,
   quantity INTEGER NOT NULL,
   rate_date DATE NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT uk_currency_date
   UNIQUE (currency_code, rate_date),

CONSTRAINT chk_rate_positive
        CHECK (rate > 0),

    CONSTRAINT chk_quantity_positive
        CHECK (quantity > 0)
);
)