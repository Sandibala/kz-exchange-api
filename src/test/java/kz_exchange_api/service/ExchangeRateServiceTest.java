package kz_exchange_api.service;

import kz_exchange_api.client.NationalBankClient;
import kz_exchange_api.dto.NationalBankRate;
import kz_exchange_api.entity.Currency;
import kz_exchange_api.entity.ExchangeRate;
import kz_exchange_api.parser.NationalBankXmlParser;
import kz_exchange_api.repository.CurrencyRepository;
import kz_exchange_api.repository.ExchangeRateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExchangeRateServiceTest {

    @Mock
    private NationalBankClient client;

    @Mock
    private NationalBankXmlParser parser;

    @Mock
    private CurrencyRepository currencyRepository;

    @Mock
    private ExchangeRateRepository exchangeRateRepository;

    @InjectMocks
    private ExchangeRateService service;

    private Currency usd;
    private NationalBankRate rateDto;
    private LocalDate date;

    @BeforeEach
    void setUp() {
        usd = new Currency("USD", "US Dollar");
        date = LocalDate.of(2026, 11, 18);

        rateDto = new NationalBankRate(
                "USD",
                new BigDecimal("496.20"),
                1,
                date
        );

        when(client.fetchRates()).thenReturn("<rss/>");
        when(parser.parse("<rss/>")).thenReturn(List.of(rateDto));
    }

    @Test
    void shouldCreateNewRateWhenNotExists() {

        when(currencyRepository.findByCode("USD"))
                .thenReturn(Optional.of(usd));

        when(exchangeRateRepository.findByCurrency_CodeAndRateDate(
                "USD", date
        )).thenReturn(Optional.empty());

        int result = service.syncRates();

        assertEquals(1, result);

        verify(exchangeRateRepository).save(argThat(rate ->
                rate.getCurrency() == usd
                        && rate.getRate().compareTo(
                        new BigDecimal("496.20")
                ) == 0
                        && rate.getQuantity() == 1
                        && rate.getRateDate().equals(date)
        ));
    }

    @Test
    void shouldUpdateExistingRate() {

        ExchangeRate existingRate = new ExchangeRate(
                usd,
                new BigDecimal("495.50"),
                1,
                date
        );

        when(currencyRepository.findByCode("USD"))
                .thenReturn(Optional.of(usd));

        when(exchangeRateRepository.findByCurrency_CodeAndRateDate(
                "USD", date
        )).thenReturn(Optional.of(existingRate));

        int result = service.syncRates();

        assertEquals(1, result);

        assertEquals(
                0,
                new BigDecimal("496.20")
                        .compareTo(existingRate.getRate())
        );

        verify(exchangeRateRepository).save(existingRate);
        verify(exchangeRateRepository, times(1)).save(any());
    }
}
