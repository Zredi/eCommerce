package com.agro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.StockDto;
import com.agro.model.Invoice;
import com.agro.model.Stock;
import com.agro.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/invoices")
public class InvoiceController {
	
	private final InvoiceService invoiceService;
	
	@GetMapping("/{orderId}")
	public ResponseEntity<Invoice> getInvoiceByOrderId(@PathVariable Long orderId){
		Invoice invoice = invoiceService.getInvoiceByOrderId(orderId);
		return ResponseEntity.ok(invoice);
	}

	@GetMapping("/offline/{offlineSaleId}")
	public ResponseEntity<Invoice> getInvoiceByOfflineSaleId(@PathVariable Long offlineSaleId){
		Invoice invoice = invoiceService.getInvoiceByOfflineSaleId(offlineSaleId);
		return ResponseEntity.ok(invoice);
	}

}
