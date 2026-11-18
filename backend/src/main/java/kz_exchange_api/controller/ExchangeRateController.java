
package kz_exchange_api.controller;

import kz_exchange_api.dto.ExchangeRateResponse;
import kz_exchange_api.service.ExchangeRateService;
import kz_exchange_api.service.ExchangeRateSyncService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rates")
public class ExchangeRateController {

    private final ExchangeRateSyncService syncService;
    private final ExchangeRateService rateService;

    public ExchangeRateController(
            ExchangeRateSyncService syncService,
            ExchangeRateService rateService
    ) {
        this.syncService = syncService;
        this.rateService = rateService;
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncRates() {
        int count = syncService.syncRates();

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "recordsProcessed", count,
                "message", "Exchange rates synchronized successfully"
        ));
    }

    @GetMapping
    public List<ExchangeRateResponse> getRates(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return rateService.getRatesByDate(date);
    }

    @GetMapping("/{code}")
    public ExchangeRateResponse getRate(
            @PathVariable String code,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return rateService.getRate(code, date);
    }

    @GetMapping("/{code}/history")
    public List<ExchangeRateResponse> getHistory(
            @PathVariable String code
    ) {
        return rateService.getHistory(code);
    }
}
