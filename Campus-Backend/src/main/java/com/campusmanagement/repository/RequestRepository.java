package com.campusmanagement.repository;

import com.campusmanagement.model.Request;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {
    List<Request> findByStudentId(String studentId);

    List<Request> findByFacultyId(String facultyId);
}
