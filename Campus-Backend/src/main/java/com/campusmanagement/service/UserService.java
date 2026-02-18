package com.campusmanagement.service;

import com.campusmanagement.model.User;
import com.campusmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    // Admin specific operations can be added here
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
