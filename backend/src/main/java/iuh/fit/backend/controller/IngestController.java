package iuh.fit.backend.controller;

import iuh.fit.backend.dto.IngestProductRequest;
import iuh.fit.backend.dto.IngestResult;
import iuh.fit.backend.service.IngestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingest")
@RequiredArgsConstructor
public class IngestController {

    private final IngestService ingestService;

    @PostMapping("/products")
    public ResponseEntity<List<IngestResult>> ingestProducts(@RequestBody List<IngestProductRequest> requests) {
        List<IngestResult> results = ingestService.ingest(requests);
        return ResponseEntity.ok(results);
    }
}
