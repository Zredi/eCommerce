package com.agro.dto;

import lombok.Data;

@Data
public class AddressDto {
	private Long id;
	private String name;
	private String phoneNo;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
