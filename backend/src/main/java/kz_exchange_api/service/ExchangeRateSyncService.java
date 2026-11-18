
package kz_exchange_api.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ExchangeRateSyncService {

    private final ExchangeRateService exchangeRateService;
    private final SyncLogService syncLogService;

    public ExchangeRateSyncService(
            ExchangeRateService exchangeRateService,
            SyncLogService syncLogService
    ) {
        this.exchangeRateService = exchangeRateService;
        this.syncLogService = syncLogService;
    }

    public int syncRates() {
        LocalDateTime startedAt = LocalDateTime.now();

        try {
            int recordsProcessed = exchangeRateService.syncRates();

            syncLogService.saveSuccess(startedAt, recordsProcessed);

            return recordsProcessed;

        } catch (Exception e) {
            syncLogService.saveFailure(
                    startedAt,
                    e.getMessage()
            );

            throw e;
        }
    }
}
