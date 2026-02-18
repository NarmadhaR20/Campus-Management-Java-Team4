package com.campusmanagement.controller;

import com.campusmanagement.model.Resource;
import com.campusmanagement.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Resource addResource(@RequestBody Resource resource) {
        return resourceService.addResource(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
    }
}
