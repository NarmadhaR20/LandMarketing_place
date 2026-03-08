package com.marketplace.landmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import com.marketplace.landmarketplace.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByBuyerId(Long buyerId);

    List<Booking> findByLandId(Long landId);

    Optional<Booking> findByBuyerIdAndLandId(Long buyerId, Long landId);

    List<Booking> findByLandOwnerId(Long ownerId);

}
