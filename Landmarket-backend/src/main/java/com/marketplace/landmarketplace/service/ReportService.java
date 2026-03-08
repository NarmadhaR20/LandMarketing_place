package com.marketplace.landmarketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.marketplace.landmarketplace.model.Report;
import com.marketplace.landmarketplace.model.User;
import com.marketplace.landmarketplace.model.Land;
import com.marketplace.landmarketplace.repository.ReportRepository;
import com.marketplace.landmarketplace.repository.UserRepository;
import com.marketplace.landmarketplace.repository.LandRepository;
import com.marketplace.landmarketplace.enums.ReportStatus;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final LandRepository landRepository;

    public ReportService(ReportRepository reportRepository,
            UserRepository userRepository,
            LandRepository landRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.landRepository = landRepository;
    }

    /**
     * Buyer files a report against a land.
     */
    public Optional<Report> createReport(Long buyerId, Long landId, String reason) {
        Optional<User> buyerOpt = userRepository.findById(buyerId);
        Optional<Land> landOpt = landRepository.findById(landId);
        if (buyerOpt.isEmpty() || landOpt.isEmpty()) {
            return Optional.empty();
        }
        Report report = new Report();
        report.setReportedBy(buyerOpt.get());
        report.setLand(landOpt.get());
        report.setReason(reason);
        report.setStatus(ReportStatus.OPEN);
        return Optional.of(reportRepository.save(report));
    }

    /**
     * Admin resolves a report, setting status to RESOLVED and applying actions.
     */
    public Optional<Report> resolveReport(Long reportId, String action, String comments) {
        return reportRepository.findById(reportId).map(r -> {
            r.setStatus(ReportStatus.RESOLVED);
            r.setResolutionAction(action);
            r.setResolutionComments(comments);

            // Apply action to the land if necessary
            Land land = r.getLand();
            if (land != null) {
                if ("Suspension".equalsIgnoreCase(action) || "Revocation".equalsIgnoreCase(action)) {
                    land.setLandStatus(com.marketplace.landmarketplace.enums.LandStatus.OFF_MARKET);
                    land.setRejectionReason("Resolution Action: " + action + " - " + comments);
                    landRepository.save(land);
                }
            }

            return reportRepository.save(r);
        });
    }

    public List<Report> getReportsByLand(Long landId) {
        return reportRepository.findByLandId(landId);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}
