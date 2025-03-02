package com.agro.service;

import com.agro.dto.UserDto;
import com.agro.model.User;
import com.agro.request.AdminCreateUserRequest;
import com.agro.request.AdminUpdateUserRequest;
import com.agro.request.CreateUserRequest;
import com.agro.request.UpdateUserRequest;

import java.util.*;

public interface UserService {

    User createUser(CreateUserRequest request);
    
    User adminCreateUser(AdminCreateUserRequest request);
    
    User adminCreateStaff(AdminCreateUserRequest request);

    User updateUser(Long userId, UpdateUserRequest request);
    
    User adminUpdateUser(Long userId, AdminUpdateUserRequest request);
    
    User adminUpdateStaff(Long userId, AdminUpdateUserRequest request);

    User getUserById(Long userId);

    List<User> getAllUsers();
    
    List<User> getAllStaffs();


    void deleteUser(Long userId);

    UserDto convertUserToDto(User user);

    User getAuthenticatedUser();

}
