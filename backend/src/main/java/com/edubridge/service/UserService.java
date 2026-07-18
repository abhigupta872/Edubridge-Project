package com.edubridge.service;

import com.edubridge.dto.JwtResponse;
import com.edubridge.dto.LoginRequest;
import com.edubridge.dto.RegisterRequest;
import com.edubridge.entity.User;
import com.edubridge.enums.UserRole;

import java.util.List;

public interface UserService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    User registerUser(RegisterRequest registerRequest);
    long countUsersByRole(UserRole role);
    List<User> getAllUsers();
    void deleteUser(Long userId);
    User getUserById(Long userId);
}
