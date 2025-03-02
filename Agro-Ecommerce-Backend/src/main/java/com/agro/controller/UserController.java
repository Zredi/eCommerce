package com.agro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.UserDto;
import com.agro.model.User;
import com.agro.request.AdminCreateUserRequest;
import com.agro.request.AdminUpdateUserRequest;
import com.agro.request.CreateUserRequest;
import com.agro.request.UpdateUserRequest;
import com.agro.response.ApiResponse;
import com.agro.service.UserService;

import lombok.RequiredArgsConstructor;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {

    private final UserService userService;

    
    /**
     * Retrieves a user by their id. If no user is found with the given id, a
     * 404 error is returned.
     * @return a ResponseEntity containing the retrieved user as a UserDto
     */
    @GetMapping("/{userId}/user")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Success", userDto));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    
    
    /**
     * Updates an existing user with the given id. If a user with the given id
     * does not exist, a 404 error is returned.
     * @return a ResponseEntity containing the updated user as a UserDto
     */
    @PutMapping("/{userId}/update")
    public ResponseEntity<ApiResponse> updateUser(@RequestBody UpdateUserRequest request, @PathVariable Long userId) {
        try {
            User user = userService.updateUser(userId, request);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Update User Success!", userDto));
        } catch (Exception e) {
           return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    
    
    /**
     * Deletes a user with the given id. If no user is found with the given id, a
     * 404 error is returned.
     * @return a ResponseEntity containing a success message if the user was
     * deleted, or an error message and a 404 status if no user was found
     */
    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse("Delete User Success!", null));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    

    /**
     * Retrieves all users from the database
     * @return a ResponseEntity containing a list of UserDto objects, or a 404 error if no users are found
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            List<UserDto> userDtos = users.stream().map(user -> userService.convertUserToDto(user)).toList();
            return ResponseEntity.ok(new ApiResponse("Success", userDtos));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/staffs")
    public ResponseEntity<ApiResponse> getAllStaffs() {
        try {
            List<User> users = userService.getAllStaffs();
            List<UserDto> userDtos = users.stream().map(user -> userService.convertUserToDto(user)).toList();
            return ResponseEntity.ok(new ApiResponse("Success", userDtos));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createUser(@RequestBody AdminCreateUserRequest request){
    	try {
            User user = userService.adminCreateUser(request);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Create User Success!", userDto));
        } catch (Exception e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }
    
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/create/staff")
    public ResponseEntity<ApiResponse> createStaff(@RequestBody AdminCreateUserRequest request){
    	try {
    		User user = userService.adminCreateStaff(request);
    		UserDto userDto = userService.convertUserToDto(user);
    		return ResponseEntity.ok(new ApiResponse("Create User Success!", userDto));
    	} catch (Exception e) {
    		return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
    	}
    }
    
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update/{userId}")
    public ResponseEntity<ApiResponse> adminUpdateUser(@RequestBody AdminUpdateUserRequest request, @PathVariable Long userId) {
        try {
            User user = userService.adminUpdateUser(userId, request);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Update User Success!", userDto));
        } catch (Exception e) {
           return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update/staff/{userId}")
    public ResponseEntity<ApiResponse> adminUpdateStaff(@RequestBody AdminUpdateUserRequest request, @PathVariable Long userId) {
    	try {
    		User user = userService.adminUpdateStaff(userId, request);
    		UserDto userDto = userService.convertUserToDto(user);
    		return ResponseEntity.ok(new ApiResponse("Update User Success!", userDto));
    	} catch (Exception e) {
    		return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
    	}
    }
    
}
