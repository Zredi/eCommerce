package com.agro.dto;

import lombok.Data;

import java.util.List;

import com.agro.model.enums.Role;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNo;
    private Role role;
    private List<OrderDto> orders;
    private CartDto cart;
    private List<AddressDto> addresses;
}
