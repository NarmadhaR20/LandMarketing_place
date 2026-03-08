package com.marketplace.landmarketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.marketplace.landmarketplace.dto.LandResponse;
import com.marketplace.landmarketplace.enums.LandStatus;
import com.marketplace.landmarketplace.model.Land;
import com.marketplace.landmarketplace.model.User;
import com.marketplace.landmarketplace.repository.LandRepository;
import com.marketplace.landmarketplace.repository.UserRepository;

@Service
public class LandService {

    private final LandRepository landRepository;
    private final UserRepository userRepository;

    public LandService(LandRepository landRepository, UserRepository userRepository) {
        this.landRepository = landRepository;
        this.userRepository = userRepository;
    }

    /**
     * Convert a {@link Land} entity to a {@link LandResponse} DTO.
     *
     * This helper is used by controllers to avoid exposing entity objects directly.
     */
    public LandResponse mapToDTO(Land land) {
        LandResponse dto = new LandResponse();

        dto.setId(land.getId());
        dto.setTitle(land.getTitle());
        dto.setLocation(land.getLocation());
        dto.setPrice(land.getPrice());
        dto.setArea(land.getArea());
        dto.setAreaUnit(land.getAreaUnit());
        if (land.getLandStatus() != null) {
            dto.setLandStatus(land.getLandStatus().name());
        }
        if (land.getLandType() != null) {
            dto.setLandType(land.getLandType().name());
        }
        dto.setAddress(land.getAddress());
        dto.setLatitude(land.getLatitude());
        dto.setLongitude(land.getLongitude());
        dto.setImage(land.getImage());

        if (land.getOwner() != null) {
            dto.setOwnerName(land.getOwner().getName());
            dto.setOwnerPhone(land.getOwner().getPrimaryMobile());
            dto.setOwnerEmail(land.getOwner().getEmail());
        }
        dto.setRejectionReason(land.getRejectionReason());
        return dto;
    }

    public Land saveLand(Land land) {
        return landRepository.save(land);
    }

    public Land createLand(Land land) {
        System.out.println("Service.createLand | Start | Title: " + land.getTitle());

        // 1️⃣ Get logged-in user's email from JWT
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        System.out.println("Service.createLand | Authenticated User: " + email);

        // 2️⃣ Fetch user from database
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.err.println("Service.createLand | ERROR | User not found: " + email);
                    return new RuntimeException("User not found");
                });

        // 3️⃣ Set owner
        land.setOwner(owner);
        System.out.println("Service.createLand | Owner Set: " + owner.getName() + " (ID: " + owner.getId() + ")");

        // 4️⃣ Set default status
        land.setLandStatus(LandStatus.PENDING);

        // 5️⃣ Save
        Land saved = landRepository.save(land);
        System.out.println("Service.createLand | Saved Successfully | ID: " + saved.getId());
        return saved;
    }

    public List<Land> getAllLands() {
        return landRepository.findAll();
    }

    public Optional<Land> getLandById(Long id) {
        return landRepository.findById(id);
    }

    public Optional<Land> updateLand(Long id, Land landDetails) {
        return landRepository.findById(id).map(existing -> {
            if (landDetails.getTitle() != null)
                existing.setTitle(landDetails.getTitle());
            if (landDetails.getLocation() != null)
                existing.setLocation(landDetails.getLocation());
            if (landDetails.getPrice() != null)
                existing.setPrice(landDetails.getPrice());
            if (landDetails.getArea() != null)
                existing.setArea(landDetails.getArea());
            if (landDetails.getAreaUnit() != null)
                existing.setAreaUnit(landDetails.getAreaUnit());
            if (landDetails.getDescription() != null)
                existing.setDescription(landDetails.getDescription());
            if (landDetails.getAddress() != null)
                existing.setAddress(landDetails.getAddress());
            if (landDetails.getLatitude() != null)
                existing.setLatitude(landDetails.getLatitude());
            if (landDetails.getLongitude() != null)
                existing.setLongitude(landDetails.getLongitude());
            if (landDetails.getImage() != null)
                existing.setImage(landDetails.getImage());

            // Reset status to PENDING on update to require re-approval
            existing.setLandStatus(LandStatus.PENDING);
            existing.setRejectionReason(null);

            return landRepository.save(existing);
        });
    }

    public boolean deleteLand(Long id) {
        if (landRepository.existsById(id)) {
            landRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Land> getApprovedLands() {
        return landRepository.findByLandStatus(LandStatus.AVAILABLE);
    }

    public Optional<Land> approveLand(Long id) {
        return landRepository.findById(id).map(land -> {
            land.setLandStatus(LandStatus.AVAILABLE);
            land.setRejectionReason(null);
            return landRepository.save(land);
        });
    }

    public Optional<Land> rejectLand(Long id, String reason) {
        return landRepository.findById(id).map(land -> {
            land.setLandStatus(LandStatus.REJECTED);
            land.setRejectionReason(reason != null && !reason.isBlank() ? reason : "Rejected by admin");
            return landRepository.save(land);
        });
    }

    public List<Land> getLandsByOwnerId(Long ownerId) {
        return landRepository.findByOwnerId(ownerId);
    }

    public List<Land> getLandsByOwnerEmail(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return landRepository.findByOwnerId(owner.getId());
    }
}
