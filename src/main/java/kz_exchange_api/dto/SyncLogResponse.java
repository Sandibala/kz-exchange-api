package kz_exchange_api.dto;
import kz_exchange_api.entity.ExchangeRateSyncLog;
import kz_exchange_api.entity.SyncStatus;
import java.time.LocalDateTime;

public record SyncLogResponse(
        Long id,
        LocalDateTime startedAt,
        LocalDateTime finishedAt,
        SyncStatus status,
        Integer recordsProcessed,
        String errorMessage
) {
    public static SyncLogResponse from(ExchangeRateSyncLog log) {
        return new SyncLogResponse(
                log.getId(),
                log.getStartedAt(),
                log.getFinishedAt(),
                log.getStatus(),
                log.getRecordsProcessed(),
                log.getErrorMessage()
        );
    }
}
