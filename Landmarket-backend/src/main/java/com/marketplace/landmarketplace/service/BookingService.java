package com.marketplace.landmarketplace.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.marketplace.landmarketplace.dto.BookingResponse;
import com.marketplace.landmarketplace.enums.BookingStatus;
import com.marketplace.landmarketplace.enums.LandStatus;
import com.marketplace.landmarketplace.exception.BadRequestException;
import com.marketplace.landmarketplace.exception.ResourceNotFoundException;
import com.marketplace.landmarketplace.model.Booking;
import com.marketplace.landmarketplace.model.Land;
import com.marketplace.landmarketplace.model.User;
import com.marketplace.landmarketplace.repository.BookingRepository;
import com.marketplace.landmarketplace.repository.LandRepository;
import com.marketplace.landmarketplace.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final LandRepository landRepository;

    public BookingService(BookingRepository bookingRepository,
            UserRepository userRepository,
            LandRepository landRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.landRepository = landRepository;
    }

    // =========================
    // DTO Mapper
    // =========================

    private BookingResponse mapToDTO(Booking booking) {

        BookingResponse dto = new BookingResponse();

        dto.setId(booking.getId());
        dto.setMessage(booking.getMessage());
        dto.setStatus(booking.getStatus().name());

        if (booking.getCreatedAt() != null) {
            dto.setCreatedAt(booking.getCreatedAt().toString());
        }

        if (booking.getBuyer() != null) {
            dto.setBuyerEmail(booking.getBuyer().getEmail());
            dto.setBuyerName(booking.getBuyer().getName());
        }

        if (booking.getLand() != null) {
            dto.setLandId(booking.getLand().getId());
            dto.setLandTitle(booking.getLand().getTitle());
            if (booking.getLand().getOwner() != null) {
                dto.setOwnerName(booking.getLand().getOwner().getName());
                dto.setOwnerPhone(booking.getLand().getOwner().getPrimaryMobile());
                dto.setOwnerEmail(booking.getLand().getOwner().getEmail());
            }
        }

        return dto;
    }

    // =========================
    // CREATE BOOKING (BUYER)
    // =========================

    public BookingResponse createBookingByEmail(String email, Long landId, String message) {

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        Land land = landRepository.findById(landId)
                .orElseThrow(() -> new ResourceNotFoundException("Land not found"));

        if (land.getOwner() != null && land.getOwner().getId().equals(buyer.getId())) {
            throw new BadRequestException("You cannot book your own land");
        }

        if (land.getLandStatus() != LandStatus.AVAILABLE) {
            throw new BadRequestException("Land is not available for booking");
        }

        if (bookingRepository.findByBuyerIdAndLandId(buyer.getId(), landId).isPresent()) {
            throw new BadRequestException("Booking already exists for this land");
        }

        Booking booking = new Booking();
        booking.setBuyer(buyer);
        booking.setLand(land);
        booking.setMessage(message);
        booking.setStatus(BookingStatus.PENDING);

        return mapToDTO(bookingRepository.save(booking));
    }

    // =========================
    // APPROVE BOOKING (OWNER)
    // =========================

    public BookingResponse approveBookingByEmail(Long bookingId, String ownerEmail) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Land land = booking.getLand();

        if (land.getOwner() == null ||
                !land.getOwner().getEmail().equals(ownerEmail)) {
            throw new BadRequestException("You are not the owner of this land");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be approved");
        }

        // Confirm booking
        booking.setStatus(BookingStatus.CONFIRMED);

        // Update land status
        land.setLandStatus(LandStatus.UNDER_CONTRACT);
        landRepository.save(land);

        return mapToDTO(bookingRepository.save(booking));
    }

    // =========================
    // REJECT BOOKING (OWNER)
    // =========================

    public BookingResponse rejectBooking(Long bookingId, String ownerEmail) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Land land = booking.getLand();

        if (land.getOwner() == null ||
                !land.getOwner().getEmail().equals(ownerEmail)) {
            throw new BadRequestException("You are not the owner of this land");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);

        return mapToDTO(bookingRepository.save(booking));
    }

    // =========================
    // CANCEL BOOKING (BUYER)
    // =========================

    public BookingResponse cancelBooking(Long bookingId, String buyerEmail) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getBuyer().getEmail().equals(buyerEmail)) {
            throw new BadRequestException("You can only cancel your own booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return mapToDTO(bookingRepository.save(booking));
    }

    // =========================
    // GET BOOKINGS BY BUYER
    // =========================

    public List<BookingResponse> getBookingsByBuyer(String buyerEmail) {

        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        return bookingRepository.findByBuyerId(buyer.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // GET BOOKINGS FOR OWNER
    // =========================

    public List<BookingResponse> getBookingsForOwner(String ownerEmail) {

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        return bookingRepository.findByLandOwnerId(owner.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // GET ALL BOOKINGS (ADMIN)
    // =========================

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

}