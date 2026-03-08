package com.marketplace.landmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.marketplace.landmarketplace.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

}
