package com.campusmanagement.controller;

import com.campusmanagement.model.Booking;
import com.campusmanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/faculty/{facultyId}")
    public List<Booking> getBookingsByFaculty(@PathVariable String facultyId) {
        return bookingService.getBookingsByFaculty(facultyId);
    }

    @PostMapping
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveBooking(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String adminId = body.get("adminId");
            return ResponseEntity.ok(bookingService.approveBooking(id, adminId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectBooking(@PathVariable String id, @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        return ResponseEntity.ok(bookingService.rejectBooking(id, reason));
    }
}
