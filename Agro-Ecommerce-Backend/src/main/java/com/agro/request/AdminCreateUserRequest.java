package com.agro.request;

import com.agro.model.enums.Role;

import lombok.Data;

@Data
public class AdminCreateUserRequest {
	 private String firstName;
	 private String lastName;
	 private String email;
	 private String password;
	 private String phoneNo;
	 private Role role;
}
