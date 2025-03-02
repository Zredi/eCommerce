package com.agro.service;

import java.util.List;

import com.agro.dto.AddressDto;
import com.agro.model.Address;

public interface AddressService {
	
	Address addAddress(Long userId, Address address); 
	
	Address getAddressById(Long addressId);

	Address updateAddress(Long addressId, Address address);

    void deleteAddress(Long addressId);

    List<Address> getAddressesByUserId(Long userId);
    
    AddressDto convertToDto(Address address);

}
