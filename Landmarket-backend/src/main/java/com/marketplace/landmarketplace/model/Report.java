package com.marketplace.landmarketplace.model;

import jakarta.persistence.*;
import com.marketplace.landmarketplace.enums.*;

@Entity
@Table(name = "reports")
public class Report {
    // fields:
    // id (primary key)
    // reportedBy (ManyToOne User, foreign key reported_by)
    // land (ManyToOne Land, foreign key land_id)
    // reason
    // status enum default OPEN
    // createdAt default current timestamp
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @ManyToOne
    @JoinColumn(name = "land_id")
    private Land land;

    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'OPEN'")
    private ReportStatus status = ReportStatus.OPEN;

    @Column(name = "resolution_action")
    private String resolutionAction;

    @Column(name = "resolution_comments", length = 1000)
    private String resolutionComments;

    @Column(name = "created_at", updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.sql.Timestamp createdAt;

    // generate getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public Land getLand() {
        return land;
    }

    public void setLand(Land land) {
        this.land = land;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getResolutionAction() {
        return resolutionAction;
    }

    public void setResolutionAction(String resolutionAction) {
        this.resolutionAction = resolutionAction;
    }

    public String getResolutionComments() {
        return resolutionComments;
    }

    public void setResolutionComments(String resolutionComments) {
        this.resolutionComments = resolutionComments;
    }
}
