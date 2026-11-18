package kz_exchange_api.repository;

import kz_exchange_api.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    Optional<ExchangeRate> findByCurrency_CodeAndRateDate(
            String code,
            LocalDate rateDate
    );

    List<ExchangeRate> findByRateDate(LocalDate rateDate);
    List<ExchangeRate> findByCurrency_CodeOrderByRateDateDesc(
            String code
    );
}
