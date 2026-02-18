package com.campusmanagement.controller;

import com.campusmanagement.model.Request;
import com.campusmanagement.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public Request createRequest(@RequestBody Request request) {
        return requestService.createRequest(request);
    }

    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasRole('FACULTY')")
    public List<Request> getRequestsByFaculty(@PathVariable String facultyId) {
        return requestService.getRequestsByFaculty(facultyId);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Request> getRequestsByStudent(@PathVariable String studentId) {
        return requestService.getRequestsByStudent(studentId);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('FACULTY')")
    public Request updateStatus(@PathVariable String id, @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        String reason = body.get("reason");
        return requestService.updateStatus(id, status, reason);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FACULTY')")
    public void deleteRequest(@PathVariable String id) {
        requestService.deleteRequest(id);
    }
}
