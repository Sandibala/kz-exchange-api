
package kz_exchange_api.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExchangeRateSyncServiceTest {

    @Mock
    private ExchangeRateService exchangeRateService;

    @Mock
    private SyncLogService syncLogService;

    @InjectMocks
    private ExchangeRateSyncService syncService;

    @Test
    void shouldSaveSuccessLogWhenSyncSucceeds() {

        when(exchangeRateService.syncRates()).thenReturn(35);

        int result = syncService.syncRates();

        assertEquals(35, result);

        verify(syncLogService).saveSuccess(
                any(LocalDateTime.class),
                eq(35)
        );

        verify(syncLogService, never()).saveFailure(
                any(LocalDateTime.class),
                anyString()
        );
    }

    @Test
    void shouldSaveFailureLogWhenSyncFails() {

        when(exchangeRateService.syncRates())
                .thenThrow(new RuntimeException("National Bank unavailable"));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> syncService.syncRates()
        );

        assertEquals(
                "National Bank unavailable",
                exception.getMessage()
        );

        verify(syncLogService).saveFailure(
                any(LocalDateTime.class),
                eq("National Bank unavailable")
        );

        verify(syncLogService, never()).saveSuccess(
                any(LocalDateTime.class),
                anyInt()
        );
    }
}
