package com.agro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.User;
import com.agro.model.enums.Role;

public interface UserRepo extends JpaRepository<User, Long>{

    boolean existsByEmail(String email);

    User findByEmail(String email);
    
    List<User> findByRole(Role role);
    
}
