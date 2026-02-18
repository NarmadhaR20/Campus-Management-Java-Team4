package com.campusmanagement.service;

import com.campusmanagement.model.User;
import com.campusmanagement.repository.UserRepository;
import com.campusmanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final Map<String, Long> lockoutCache = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 3;
    private static final long LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

    public String login(String email, String password) {
        if (isLocked(email)) {
            throw new RuntimeException("Account temporarily locked due to 3 failed attempts. Please try again later.");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            final User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User data not found after authentication"));

            clearAttempts(email);
            return jwtUtil.generateToken(userDetails.getUsername(), user.getRole(), user.getId());
        } catch (org.springframework.security.core.AuthenticationException e) {
            failAttempt(email);
            int remaining = MAX_ATTEMPTS - attemptsCache.getOrDefault(email, 0);
            if (remaining <= 0) {
                throw new RuntimeException("Too many failed attempts. Account locked for 30 minutes.");
            }
            throw new RuntimeException("Invalid email or password. " + remaining + " attempts remaining.");
        }
    }

    private boolean isLocked(String email) {
        if (lockoutCache.containsKey(email)) {
            long lockTime = lockoutCache.get(email);
            if (System.currentTimeMillis() - lockTime > LOCKOUT_DURATION) {
                lockoutCache.remove(email);
                attemptsCache.remove(email);
                return false;
            }
            return true;
        }
        return false;
    }

    private void failAttempt(String email) {
        int attempts = attemptsCache.getOrDefault(email, 0) + 1;
        attemptsCache.put(email, attempts);
        if (attempts >= MAX_ATTEMPTS) {
            lockoutCache.put(email, System.currentTimeMillis());
        }
    }

    private void clearAttempts(String email) {
        attemptsCache.remove(email);
        lockoutCache.remove(email);
    }

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus("ACTIVE");
        user.setCreatedAt(new Date());
        return userRepository.save(user);
    }
}
