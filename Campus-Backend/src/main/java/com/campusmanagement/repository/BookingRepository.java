package com.campusmanagement.repository;

import com.campusmanagement.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByFacultyId(String facultyId);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByResourceIdAndEventDateAndStatus(String resourceId, java.util.Date eventDate, String status);
}
