package com.campusmanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // STUDENT, FACULTY, ADMIN
    private String department;
    private String status; // ACTIVE, INACTIVE
    private Date createdAt;
}
