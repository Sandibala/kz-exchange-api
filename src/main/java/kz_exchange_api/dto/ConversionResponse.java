package kz_exchange_api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ConversionResponse(
        String from,
        String to,
        BigDecimal amount,
        BigDecimal convertedAmount,
        LocalDate rateDate
) {
}
