package kz_exchange_api.controller;

import kz_exchange_api.dto.CurrencyResponse;
import kz_exchange_api.service.CurrencyService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/currencies")
public class CurrencyController {

    private final CurrencyService service;

    public CurrencyController(CurrencyService service) {
        this.service = service;
    }

    @GetMapping
    public List<CurrencyResponse> getCurrencies() {
        return service.getCurrencies();
    }
}
