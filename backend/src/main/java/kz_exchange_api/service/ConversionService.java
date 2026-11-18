
package kz_exchange_api.service;

import kz_exchange_api.dto.ConversionResponse;
import kz_exchange_api.entity.ExchangeRate;
import kz_exchange_api.repository.ExchangeRateRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Locale;

@Service
public class ConversionService {

    private final ExchangeRateRepository rateRepository;

    public ConversionService(ExchangeRateRepository rateRepository) {
        this.rateRepository = rateRepository;
    }

    @Transactional(readOnly = true)
    public ConversionResponse convert(
            String from,
            String to,
            BigDecimal amount,
            LocalDate date
    ) {
        from = from.toUpperCase(Locale.ROOT);
        to = to.toUpperCase(Locale.ROOT);

        if (amount == null || amount.signum() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Amount must be zero or positive"
            );
        }

        BigDecimal fromRate = getRateInKzt(from, date);
        BigDecimal toRate = getRateInKzt(to, date);

        BigDecimal result = amount
                .multiply(fromRate)
                .divide(toRate, 6, RoundingMode.HALF_UP);

        return new ConversionResponse(
                from,
                to,
                amount,
                result,
                date
        );
    }

    private BigDecimal getRateInKzt(String code, LocalDate date) {

        if ("KZT".equals(code)) {
            return BigDecimal.ONE;
        }

        ExchangeRate exchangeRate = rateRepository
                .findByCurrency_CodeAndRateDate(code, date)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rate not found for " + code + " on " + date
                ));

        return exchangeRate.getRate().divide(
                BigDecimal.valueOf(exchangeRate.getQuantity()),
                12,
                RoundingMode.HALF_UP
        );
    }
}
