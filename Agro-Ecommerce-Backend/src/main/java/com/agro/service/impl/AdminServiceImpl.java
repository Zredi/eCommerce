package com.agro.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.agro.model.User;
import com.agro.model.enums.Role;
import com.agro.repository.UserRepo;
import com.agro.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{
	
	private final UserRepo userRepo;

	@Override
	public List<Long> getAdminUserIds() {
		
		return userRepo.findByRole(Role.ROLE_ADMIN)
				.stream()
				.map(User :: getId)
				.toList();
	}

}
