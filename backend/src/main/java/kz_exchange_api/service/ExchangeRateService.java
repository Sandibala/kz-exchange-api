package kz_exchange_api.service;

import kz_exchange_api.client.NationalBankClient;
import kz_exchange_api.dto.ExchangeRateResponse;
import kz_exchange_api.dto.NationalBankRate;
import kz_exchange_api.entity.Currency;
import kz_exchange_api.entity.ExchangeRate;
import kz_exchange_api.parser.NationalBankXmlParser;
import kz_exchange_api.repository.CurrencyRepository;
import kz_exchange_api.repository.ExchangeRateRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExchangeRateService {

    private final NationalBankClient client;
    private final NationalBankXmlParser parser;
    private final CurrencyRepository currencyRepository;
    private final ExchangeRateRepository exchangeRateRepository;

    public ExchangeRateService(
            NationalBankClient client,
            NationalBankXmlParser parser,
            CurrencyRepository currencyRepository,
            ExchangeRateRepository exchangeRateRepository
    ) {
        this.client = client;
        this.parser = parser;
        this.currencyRepository = currencyRepository;
        this.exchangeRateRepository = exchangeRateRepository;
    }

    @Transactional
    public int syncRates() {

        String xml = client.fetchRates();
        List<NationalBankRate> rates = parser.parse(xml);

        for (NationalBankRate rateDto : rates) {

            Currency currency = currencyRepository
                    .findByCode(rateDto.currencyCode())
                    .orElseGet(() -> currencyRepository.save(
                            new Currency(
                                    rateDto.currencyCode(),
                                    rateDto.currencyCode()
                            )
                    ));

            ExchangeRate exchangeRate = exchangeRateRepository
                    .findByCurrency_CodeAndRateDate(
                            rateDto.currencyCode(),
                            rateDto.rateDate()
                    )
                    .orElseGet(() -> new ExchangeRate(
                            currency,
                            rateDto.rate(),
                            rateDto.quantity(),
                            rateDto.rateDate()
                    ));

            exchangeRate.setRate(rateDto.rate());
            exchangeRate.setQuantity(rateDto.quantity());

            exchangeRateRepository.save(exchangeRate);
        }
        return rates.size();
    }

    @Transactional(readOnly = true)
    public List<ExchangeRateResponse> getRatesByDate(LocalDate date) {
        return exchangeRateRepository.findByRateDate(date)
                .stream()
                .map(ExchangeRateResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExchangeRateResponse getRate(String code, LocalDate date) {
        return exchangeRateRepository
                .findByCurrency_CodeAndRateDate(
                        code.toUpperCase(),
                        date
                )
                .map(ExchangeRateResponse::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Exchange rate not found"
                ));
    }

    @Transactional(readOnly = true)
    public List<ExchangeRateResponse> getHistory(String code) {
        return exchangeRateRepository
                .findByCurrency_CodeOrderByRateDateDesc(
                        code.toUpperCase()
                )
                .stream()
                .map(ExchangeRateResponse::from)
                .toList();
    }
}
