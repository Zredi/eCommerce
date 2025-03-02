package com.agro.request;

import com.agro.model.enums.Role;

import lombok.Data;

@Data
public class AdminUpdateUserRequest {
	private String firstName;
    private String lastName;
    private String email;
    private String phoneNo;
    private Role role;
}
