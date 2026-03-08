package com.marketplace.landmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.marketplace.landmarketplace.model.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByLandId(Long landId);
}
