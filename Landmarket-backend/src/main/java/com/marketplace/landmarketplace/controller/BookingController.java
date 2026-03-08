package com.marketplace.landmarketplace.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.landmarketplace.dto.BookingResponse;
import com.marketplace.landmarketplace.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // =========================
    // CREATE BOOKING (BUYER)
    // =========================
    @PostMapping("/land/{landId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<BookingResponse> createBooking(
            @PathVariable Long landId,
            @RequestBody BookingRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        BookingResponse response = bookingService.createBookingByEmail(
                email,
                landId,
                request.getMessage());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // =========================
    // APPROVE BOOKING (OWNER)
    // =========================
    @PutMapping("/{bookingId}/approve")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String email = authentication.getName();

        BookingResponse response = bookingService.approveBookingByEmail(bookingId, email);

        return ResponseEntity.ok(response);
    }

    // =========================
    // REJECT BOOKING (OWNER)
    // =========================
    @PutMapping("/{bookingId}/reject")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String email = authentication.getName();

        BookingResponse response = bookingService.rejectBooking(bookingId, email);

        return ResponseEntity.ok(response);
    }

    // =========================
    // CANCEL BOOKING (BUYER)
    // =========================
    @PutMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String email = authentication.getName();

        BookingResponse response = bookingService.cancelBooking(bookingId, email);

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET MY BOOKINGS (BUYER)
    // =========================
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            Authentication authentication) {

        String email = authentication.getName();

        List<BookingResponse> list = bookingService.getBookingsByBuyer(email);

        return ResponseEntity.ok(list);
    }

    // =========================
    // GET OWNER REQUESTS (OWNER)
    // =========================
    @GetMapping("/owner-requests")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<BookingResponse>> getOwnerRequests(
            Authentication authentication) {

        String email = authentication.getName();

        List<BookingResponse> list = bookingService.getBookingsForOwner(email);

        return ResponseEntity.ok(list);
    }

    // =========================
    // REQUEST DTO
    // =========================
    public static class BookingRequest {
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // =========================
    // GET ALL BOOKINGS (ADMIN)
    // =========================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}