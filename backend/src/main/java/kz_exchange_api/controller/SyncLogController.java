package kz_exchange_api.controller;

import kz_exchange_api.dto.SyncLogResponse;
import kz_exchange_api.service.SyncLogService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sync-logs")
public class SyncLogController {
    private final SyncLogService service;
    public SyncLogController(SyncLogService service) {
        this.service = service;
    }
    @GetMapping
    public List<SyncLogResponse> getLogs() {
        return service.getLogs();
    }
}
