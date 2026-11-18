package kz_exchange_api.service;

import kz_exchange_api.dto.CurrencyResponse;
import kz_exchange_api.repository.CurrencyRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CurrencyService {

    private final CurrencyRepository repository;

    public CurrencyService(CurrencyRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CurrencyResponse> getCurrencies() {
        return repository.findAll()
                .stream()
                .map(CurrencyResponse::from)
                .toList();
    }
}
