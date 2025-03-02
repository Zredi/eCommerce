package com.agro.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMethod;
import org.modelmapper.ModelMapper;

import com.agro.dto.UserDto;
import com.agro.model.User;
import com.agro.model.enums.Role;
import com.agro.repository.UserRepo;
import com.agro.request.AdminCreateUserRequest;
import com.agro.request.AdminUpdateUserRequest;
import com.agro.request.CreateUserRequest;
import com.agro.request.UpdateUserRequest;
import com.agro.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new user. If a user with the same email already exists, a
     * RuntimeException is thrown.
     * @return the created user
     */
    @Override
    public User createUser(CreateUserRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNo(request.getPhoneNo());
        user.setRole(Role.ROLE_USER);
        return userRepo.save(user);
    }
    
    @Override
    public User adminCreateUser(AdminCreateUserRequest request) {
    	if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNo(request.getPhoneNo());
        user.setRole(request.getRole());
        return userRepo.save(user);
    }
    
    @Override
    public User adminCreateStaff(AdminCreateUserRequest request) {
    	if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNo(request.getPhoneNo());
        user.setRole(request.getRole());
        return userRepo.save(user);
    }

    /**
     * Updates an existing user with the given id. If a user with the given id
     * does not exist, a RuntimeException is thrown.
     * @return the updated user
     */
    @Override
    public User updateUser(Long userId, UpdateUserRequest request) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setPhoneNo(request.getPhoneNo());
        return userRepo.save(existingUser);
    }
    
    @Override
    public User adminUpdateUser(Long userId, AdminUpdateUserRequest request) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setEmail(request.getEmail());
        existingUser.setPhoneNo(request.getPhoneNo());
        return userRepo.save(existingUser);
    }
    
    @Override
    public User adminUpdateStaff(Long userId, AdminUpdateUserRequest request) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setEmail(request.getEmail());
        existingUser.setPhoneNo(request.getPhoneNo());
        existingUser.setRole(request.getRole());
        return userRepo.save(existingUser);
    }

    /**
     * Retrieves a user by their id. If no user is found with the given id, a
     * RuntimeException is thrown.
     * @return the user
     */
    @Override
    public User getUserById(Long userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    /**
     * Retrieves all users from the database
     * @return a list of users
     */
    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll().stream()
        		.filter(user -> user.getRole().equals(Role.ROLE_USER))
        		.collect(Collectors.toList());
    }
    
    @Override
    public List<User> getAllStaffs() {
        return userRepo.findAll().stream()
        		.filter(user -> user.getRole().equals(Role.ROLE_MODERATOR))
        		.collect(Collectors.toList());
    }

    /**
     * Delete a user with the given id.
     * RuntimeException if no user with the given id is found
     */
    @Override
    public void deleteUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));
        userRepo.delete(user);
    }

    /**
     * Retrieves the authenticated user.
     * @return the authenticated user
     */
    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepo.findByEmail(email);
    }

    /**
     * Converts a given user to its corresponding data transfer object.
     * 
     * @return the converted user data transfer object
     */
    @Override
    public UserDto convertUserToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

}
