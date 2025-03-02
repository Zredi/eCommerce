package com.agro.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.ReturnDto;
import com.agro.model.Return;
import com.agro.service.ReturnService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/returns")
public class ReturnController {
	
	private final ReturnService returnService;
	
	@GetMapping("/all")
	public ResponseEntity<List<ReturnDto>> getAllReturns(){
		List<Return> returns = returnService.getAllReturns();
		List<ReturnDto> returnDtos = returns.stream().map(returnService::convertToDTO).collect(Collectors.toList());
		return ResponseEntity.ok(returnDtos);
	}
	
	@PostMapping("/request")
	public ResponseEntity<ReturnDto> requestReturn(@RequestParam Long userId, @RequestParam Long orderId, @RequestParam String reason) {
		Return returnEntity = returnService.createReturn(userId, orderId, reason);
		ReturnDto returnDto = returnService.convertToDTO(returnEntity);
		return ResponseEntity.ok(returnDto);
	}
	
	@GetMapping("/user/{userId}")
    public ResponseEntity<List<ReturnDto>> getUserReturns(@PathVariable Long userId) {
        List<Return> returns = returnService.getUserReturns(userId);
        List<ReturnDto> returnDtos = returns.stream().map(returnService :: convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(returnDtos);
    }
	
	@GetMapping("/order/{orderId}")
	public ResponseEntity<ReturnDto> getReturnByOrderId(@PathVariable Long orderId) {
		Return returnEntity = returnService.getByOrder(orderId);
		ReturnDto returnDto = returnService.convertToDTO(returnEntity);
		return ResponseEntity.ok(returnDto);
		
	}

    @PutMapping("/{returnId}/status")
    public ResponseEntity<ReturnDto> updateReturnStatus(@PathVariable Long returnId, @RequestParam String status) {
        Return returnEntity = returnService.updateReturnStatus(returnId, status);
        ReturnDto returnDto = returnService.convertToDTO(returnEntity);
        return ResponseEntity.ok(returnDto);
    }

}
