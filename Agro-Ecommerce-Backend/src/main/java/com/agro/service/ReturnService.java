package com.agro.service;

import java.util.List;

import com.agro.dto.ReturnDto;
import com.agro.model.Return;

public interface ReturnService {
	
	Return createReturn(Long userId, Long orderId, String reason);
	
	List<Return> getUserReturns(Long userId);
	
	List<Return> getAllReturns();
	
	Return updateReturnStatus(Long returnId, String status);

	Return getByOrder(Long orderId);
	
	ReturnDto convertToDTO(Return returnObj);

}
