package com.marketplace.landmarketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.landmarketplace.model.Report;
import com.marketplace.landmarketplace.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/buyer/{buyerId}/land/{landId}")
    public ResponseEntity<Report> createReport(@PathVariable Long buyerId,
            @PathVariable Long landId,
            @RequestBody ReportRequest request) {
        Optional<Report> opt = reportService.createReport(buyerId, landId, request.getReason());
        return opt.map(r -> new ResponseEntity<>(r, HttpStatus.CREATED))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/{reportId}/resolve")
    public ResponseEntity<Report> resolveReport(@PathVariable Long reportId, @RequestBody ResolutionRequest request) {
        Optional<Report> opt = reportService.resolveReport(reportId, request.getAction(), request.getComments());
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/land/{landId}")
    public ResponseEntity<List<Report>> getReportsByLand(@PathVariable Long landId) {
        List<Report> list = reportService.getReportsByLand(landId);
        return ResponseEntity.ok(list);
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // Inner class for request body
    public static class ReportRequest {
        private String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    public static class ResolutionRequest {
        private String action;
        private String comments;

        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public String getComments() {
            return comments;
        }

        public void setComments(String comments) {
            this.comments = comments;
        }
    }
}
