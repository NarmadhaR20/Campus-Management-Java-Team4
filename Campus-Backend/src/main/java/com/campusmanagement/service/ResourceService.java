package com.campusmanagement.service;

import com.campusmanagement.model.Resource;
import com.campusmanagement.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource addResource(Resource resource) {
        resource.setCreatedAt(new Date());
        resource.setStatus("AVAILABLE");
        return resourceRepository.save(resource);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    public Resource updateResource(String id, Resource resourceDetails) {
        Resource resource = resourceRepository.findById(id).orElseThrow();
        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setLocation(resourceDetails.getLocation());
        return resourceRepository.save(resource);
    }
}
