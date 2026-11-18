
package kz_exchange_api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NationalBankRate(
        String currencyCode,
        BigDecimal rate,
        Integer quantity,
        LocalDate rateDate
) {
}
