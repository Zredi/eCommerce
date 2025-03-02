package com.agro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Address;

public interface AddressRepo extends JpaRepository<Address, Long>{
	
	List<Address> findByUserId(Long userId);

}
