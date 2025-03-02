package com.agro.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.agro.dto.AddressDto;
import com.agro.model.Address;
import com.agro.model.User;
import com.agro.repository.AddressRepo;
import com.agro.repository.UserRepo;
import com.agro.service.AddressService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService{
	
	private final AddressRepo addressRepo;
	private final UserRepo userRepo;
	private final ModelMapper modelMapper;
	
	@Override
	public Address addAddress(Long userId, Address address) {
		
		User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
		address.setUser(user);
		return addressRepo.save(address);
	}
	
	@Override
	public Address getAddressById(Long addressId) {
		return addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
	}

	@Override
	public Address updateAddress(Long addressId, Address address) {
		Address existingAddress = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
		existingAddress.setName(address.getName());
		existingAddress.setPhoneNo(address.getPhoneNo());
		existingAddress.setCity(address.getCity());
		existingAddress.setCountry(address.getCountry());
		existingAddress.setState(address.getState());
		existingAddress.setStreet(address.getStreet());
		existingAddress.setZipCode(address.getZipCode());
		
		return addressRepo.save(existingAddress);
	}

	@Override
	public void deleteAddress(Long addressId) {
		Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
		addressRepo.delete(address);
	}

	@Override
	public List<Address> getAddressesByUserId(Long userId) {
		return addressRepo.findByUserId(userId);
	}

	@Override
	public AddressDto convertToDto(Address address) {
		return modelMapper.map(address, AddressDto.class);
	}

}
