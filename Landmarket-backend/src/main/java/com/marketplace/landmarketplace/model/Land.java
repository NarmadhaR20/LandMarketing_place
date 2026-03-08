package com.marketplace.landmarketplace.model;

import jakarta.persistence.*;
import com.marketplace.landmarketplace.enums.LandType;
import com.marketplace.landmarketplace.enums.LandStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lands")
public class Land {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String location;

    private String address;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    private Double area;

    private String areaUnit;

    @Column(length = 1000)
    private String description;

    // Many lands belong to one owner
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Enumerated(EnumType.STRING)
    private LandType landType;

    @Enumerated(EnumType.STRING)
    private LandStatus landStatus = LandStatus.PENDING;

    private Double latitude;

    private Double longitude;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    private String rejectionReason;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters & Setters

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public String getAreaUnit() {
        return areaUnit;
    }

    public void setAreaUnit(String areaUnit) {
        this.areaUnit = areaUnit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public LandType getLandType() {
        return landType;
    }

    public void setLandType(LandType landType) {
        this.landType = landType;
    }

    public LandStatus getLandStatus() {
        return landStatus;
    }

    public void setLandStatus(LandStatus landStatus) {
        this.landStatus = landStatus;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}