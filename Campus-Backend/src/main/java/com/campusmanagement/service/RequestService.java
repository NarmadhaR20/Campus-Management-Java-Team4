package com.campusmanagement.service;

import com.campusmanagement.model.Request;
import com.campusmanagement.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    public Request createRequest(Request request) {
        request.setStatus("PENDING");
        request.setCreatedAt(new Date());
        return requestRepository.save(request);
    }

    public List<Request> getRequestsByFaculty(String facultyId) {
        return requestRepository.findByFacultyId(facultyId);
    }

    public List<Request> getRequestsByStudent(String studentId) {
        return requestRepository.findByStudentId(studentId);
    }

    // Faculty can Accept/Reject
    public Request updateStatus(String id, String status) {
        return updateStatus(id, status, null);
    }

    public Request updateStatus(String id, String status, String reason) {
        Request request = requestRepository.findById(id).orElseThrow();
        request.setStatus(status);
        if (reason != null) {
            request.setRejectionReason(reason);
        }
        return requestRepository.save(request);
    }

    public void deleteRequest(String id) {
        requestRepository.deleteById(id);
    }
}
