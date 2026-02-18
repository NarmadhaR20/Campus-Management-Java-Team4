package com.campusmanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "requests")
public class Request {
    @Id
    private String id;
    private String studentId;
    private String facultyId;
    private String eventTitle;
    private String resourceId;
    private String eventDate;
    private String timeSlot;
    private String description;
    private String status; // PENDING, ACCEPTED, REJECTED
    private String rejectionReason;
    private Date createdAt;
}
