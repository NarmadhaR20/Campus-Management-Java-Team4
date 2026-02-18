package com.campusmanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String name;
    private String type; // LAB, CLASSROOM, EVENT_HALL
    private int capacity;
    private String location;
    private String status; // AVAILABLE, UNAVAILABLE
    private Date createdAt;
}
