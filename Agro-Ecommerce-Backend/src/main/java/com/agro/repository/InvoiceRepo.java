package com.agro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agro.model.Invoice;

public interface InvoiceRepo extends JpaRepository<Invoice, Long>{
	
	@Query("SELECT i FROM Invoice i WHERE i.order.id = :orderId")
    Invoice findByOrderId(@Param("orderId") Long orderId);
    
    @Query("SELECT i FROM Invoice i WHERE i.offlineSale.id = :offlineSaleId")
    Invoice findByOfflineSaleId(@Param("offlineSaleId") Long offlineSaleId);
}
