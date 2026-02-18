package com.campusmanagement.service;

import com.campusmanagement.model.Booking;
import com.campusmanagement.repository.BookingRepository;
import com.campusmanagement.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private RequestService requestService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByFaculty(String facultyId) {
        return bookingRepository.findByFacultyId(facultyId);
    }

    public Booking createBooking(Booking booking) {
        // Double Booking Prevention Logic
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndEventDateAndStatus(
                booking.getResourceId(), booking.getEventDate(), "APPROVED");

        if (isOverlapping(existingBookings, booking.getTimeSlot())) {
            throw new RuntimeException("Resource is already booked for this time slot.");
        }

        booking.setRequestedAt(new Date());
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public Booking approveBooking(String id, String adminId) {
        Booking booking = bookingRepository.findById(id).orElseThrow();

        // Final check before approval to ensure no race conditions
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndEventDateAndStatus(
                booking.getResourceId(), booking.getEventDate(), "APPROVED");

        if (isOverlapping(existingBookings, booking.getTimeSlot())) {
            booking.setStatus("REJECTED");
            bookingRepository.save(booking);
            throw new RuntimeException("Resource is already booked. Booking Rejected.");
        }

        booking.setStatus("APPROVED");
        booking.setApprovedBy(adminId);
        booking.setApprovedAt(new Date());

        // Sync Resource Status
        try {
            String resId = booking.getResourceId();
            System.out.println("Attempting to sync status for Resource ID: " + resId);

            resourceRepository.findById(resId).ifPresentOrElse(res -> {
                res.setStatus("BOOKED");
                resourceRepository.save(res);
                System.out.println("SUCCESS: Resource " + res.getName() + " (ID: " + resId + ") marked as BOOKED.");
            }, () -> {
                System.err.println("FAILURE: Resource ID " + resId + " not found in database. Status sync failed.");
            });
        } catch (Exception e) {
            System.err.println("EXCEPTION during resource sync: " + e.getMessage());
            e.printStackTrace();
        }

        // SYNC STATUS: If this booking came from a student suggestion, mark it as
        // officially APPROVED
        if (booking.getRequestId() != null && !booking.getRequestId().isEmpty()) {
            try {
                requestService.updateStatus(booking.getRequestId(), "APPROVED");
            } catch (Exception e) {
                System.err.println("Failed to sync Request status: " + e.getMessage());
            }
        }

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);

        // Sync with linked Request if exists
        if (booking.getRequestId() != null && !booking.getRequestId().isEmpty()) {
            try {
                requestService.updateStatus(booking.getRequestId(), "REJECTED", reason);
            } catch (Exception e) {
                System.err.println("Failed to sync rejection to Request: " + e.getMessage());
            }
        }

        return bookingRepository.save(booking);
    }

    private boolean isOverlapping(List<Booking> existingBookings, String newTimeSlot) {
        try {
            String[] newTimes = newTimeSlot.split("-");
            LocalTime newStart = LocalTime.parse(newTimes[0].trim());
            LocalTime newEnd = LocalTime.parse(newTimes[1].trim());

            // Add 30-minute buffer for overlap check
            // A buffer is added to the start and end of the new booking
            // to ensure it doesn't collide with existing ones within 30 mins
            for (Booking b : existingBookings) {
                String[] existingTimes = b.getTimeSlot().split("-");
                LocalTime existingStart = LocalTime.parse(existingTimes[0].trim());
                LocalTime existingEnd = LocalTime.parse(existingTimes[1].trim());

                // Traditional overlap check: (StartA < EndB) and (EndA > StartB)
                // BUT we add a 30-minute buffer to the existing end and existing start
                // to prevent bookings that are too close.

                LocalTime bufferedExistingEnd = existingEnd.plusMinutes(30);
                LocalTime bufferedExistingStart = existingStart.minusMinutes(30);

                if (newStart.isBefore(bufferedExistingEnd) && newEnd.isAfter(bufferedExistingStart)) {
                    return true;
                }
            }
        } catch (Exception e) {
            System.err.println("Booking time slot parsing error: " + e.getMessage());
        }
        return false;
    }
}
