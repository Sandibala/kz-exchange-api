package kz_exchange_api.repository;

import kz_exchange_api.entity.ExchangeRateSyncLog;
import kz_exchange_api.entity.SyncStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ExchangeRateSyncLogRepository
        extends JpaRepository<ExchangeRateSyncLog, Long> {

    List<ExchangeRateSyncLog> findByStatus(
            SyncStatus status
    );

    Optional<ExchangeRateSyncLog> findTopByOrderByStartedAtDesc();
}
