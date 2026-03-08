package com.marketplace.landmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.marketplace.landmarketplace.model.Land;
import com.marketplace.landmarketplace.enums.LandStatus;

public interface LandRepository extends JpaRepository<Land, Long> {
    List<Land> findByLandStatus(LandStatus landStatus);

    List<Land> findByOwnerId(Long ownerId);
}
