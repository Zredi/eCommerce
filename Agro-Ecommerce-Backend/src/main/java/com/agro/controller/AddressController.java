package com.agro.controller;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.AddressDto;
import com.agro.dto.UserDto;
import com.agro.model.Address;
import com.agro.model.User;
import com.agro.response.ApiResponse;
import com.agro.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/address")
public class AddressController {
	
	private final AddressService addressService;
	
	@PostMapping("/add/{userId}")
    public ResponseEntity<ApiResponse> addAddress(@PathVariable Long userId, @RequestBody Address address) {
        
		try {
			Address createdAddress = addressService.addAddress(userId, address);
	        
	        AddressDto responseDto = addressService.convertToDto(createdAddress);
	        return ResponseEntity.ok(new ApiResponse("Address add Success!", responseDto));
		}catch (Exception e) {
			return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
		}
    }
	
	@GetMapping("/{addressId}/address")
	public ResponseEntity<ApiResponse> getAddressById(@PathVariable Long addressId) {
        try {
            Address address = addressService.getAddressById(addressId);
            AddressDto addressDto = addressService.convertToDto(address);
            return ResponseEntity.ok(new ApiResponse("Success", addressDto));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable Long addressId, @RequestBody Address address) {
        
    	try {
    		Address updatedAddress = addressService.updateAddress(addressId, address);
            
            AddressDto responseDto = addressService.convertToDto(updatedAddress);
            return ResponseEntity.ok(new ApiResponse("Update address Success!", responseDto));
    	} catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long addressId) {
        try {
        	addressService.deleteAddress(addressId);
        	return ResponseEntity.ok(new ApiResponse("Delete address Success!", null));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{userId}/addresses")
    public ResponseEntity<ApiResponse> getAddressesByUserId(@PathVariable Long userId) {
    	try {
            List<Address> addresses = addressService.getAddressesByUserId(userId);
            List<AddressDto> addressDtos = addresses.stream().map(address -> addressService.convertToDto(address)).toList();
            return ResponseEntity.ok(new ApiResponse("Success", addressDtos));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    

}
