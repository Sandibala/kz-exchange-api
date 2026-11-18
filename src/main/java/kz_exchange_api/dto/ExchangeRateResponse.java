package kz_exchange_api.dto;
import kz_exchange_api.entity.ExchangeRate;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExchangeRateResponse(
        String currencyCode,
        BigDecimal rate,
        Integer quantity,
        LocalDate rateDate
) {
    public static ExchangeRateResponse from(ExchangeRate entity) {
        return new ExchangeRateResponse(
                entity.getCurrency().getCode(),
                entity.getRate(),
                entity.getQuantity(),
                entity.getRateDate()
        );
    }
}
