package com.campusmanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String facultyId;
    private String resourceId;
    private String eventName;
    private Date eventDate;
    private String timeSlot; // e.g., "10:00-12:00"
    private String status; // PENDING, APPROVED, REJECTED
    private String requestId; // Linked Request ID (if any)
    private Date requestedAt;
    private String approvedBy;
    private Date approvedAt;
    private String rejectionReason;
    private String description;
}
