package kz_exchange_api.service;

import kz_exchange_api.dto.SyncLogResponse;
import kz_exchange_api.entity.ExchangeRateSyncLog;
import kz_exchange_api.entity.SyncStatus;
import kz_exchange_api.repository.ExchangeRateSyncLogRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SyncLogService {

    private final ExchangeRateSyncLogRepository repository;

    public SyncLogService(ExchangeRateSyncLogRepository repository) {
        this.repository = repository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveSuccess(LocalDateTime startedAt, int recordsProcessed) {

        ExchangeRateSyncLog log = new ExchangeRateSyncLog(
                startedAt,
                SyncStatus.SUCCESS
        );

        log.setFinishedAt(LocalDateTime.now());
        log.setRecordsProcessed(recordsProcessed);

        repository.save(log);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveFailure(LocalDateTime startedAt, String errorMessage) {

        ExchangeRateSyncLog log = new ExchangeRateSyncLog(
                startedAt,
                SyncStatus.FAILED
        );

        log.setFinishedAt(LocalDateTime.now());
        log.setRecordsProcessed(0);
        log.setErrorMessage(errorMessage);

        repository.save(log);
    }

    @Transactional(readOnly = true)
    public List<SyncLogResponse> getLogs() {
        return repository.findAll()
                .stream()
                .map(SyncLogResponse::from)
                .toList();
    }
}
