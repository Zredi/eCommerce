package com.agro.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.agro.dto.ReturnDto;
import com.agro.dto.StockDto;
import com.agro.model.Order;
import com.agro.model.Return;
import com.agro.model.User;
import com.agro.repository.OrderRepo;
import com.agro.repository.ReturnRepo;
import com.agro.repository.UserRepo;
import com.agro.service.ReturnService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReturnServiceImpl implements ReturnService{
	
	private final ReturnRepo returnRepo;
	private final OrderRepo orderRepo;
	private final UserRepo userRepo;
	private final ModelMapper modelMapper;

	@Override
	public Return createReturn(Long userId, Long orderId, String reason) {
		Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		
		Return returnReq = Return.builder()
				.order(order)
				.user(user)
				.reason(reason)
				.status("PENDING")
				.requestDate(LocalDateTime.now())
				.build();
		
		return returnRepo.save(returnReq);
	}

	@Override
	public List<Return> getUserReturns(Long userId) {
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		return returnRepo.findByUser(user);
	}

	@Override
	public Return updateReturnStatus(Long returnId, String status) {
		Return returnReq = returnRepo.findById(returnId).orElseThrow(() -> new RuntimeException("Return request not found"));
		returnReq.setStatus(status);
		return returnRepo.save(returnReq);
	}

	@Override
	public Return getByOrder(Long orderId) {
		Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
		return returnRepo.findByOrder(order);
	}

	@Override
	public ReturnDto convertToDTO(Return returnObj) {
		return modelMapper.map(returnObj, ReturnDto.class);
	}

	@Override
	public List<Return> getAllReturns() {
		return returnRepo.findAll();
	}

}
