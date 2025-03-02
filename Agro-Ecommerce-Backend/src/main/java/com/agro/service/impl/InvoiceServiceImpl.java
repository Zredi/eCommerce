package com.agro.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.agro.model.Invoice;
import com.agro.model.OfflineSale;
import com.agro.model.Order;
import com.agro.repository.InvoiceRepo;
import com.agro.repository.OfflineSaleRepo;
import com.agro.repository.OrderRepo;
import com.agro.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService{
	
	private final InvoiceRepo invoiceRepo;
	private final OrderRepo orderRepo;
	private final OfflineSaleRepo offlineSaleRepo;

	@Override
	public Invoice generateInvoice(Long orderId) {
	Order order = orderRepo.findById(orderId)
    .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    Invoice invoice = new Invoice();
    invoice.setOrder(order);
    invoice.setInvoiceDate(LocalDate.now());
    invoice.setTotalAmount(order.getTotalAmount());

    String uniqueInvoiceNumber = generateUniqueInvoiceNumber();
    invoice.setInvoiceNumber(uniqueInvoiceNumber);

    return invoiceRepo.save(invoice);
	}

    @Override
    public Invoice generateOfflineInvoice(Long offlineSaleId) {
        OfflineSale sale = offlineSaleRepo.findById(offlineSaleId)
            .orElseThrow(() -> new IllegalArgumentException("Offline sale not found"));

        Invoice invoice = new Invoice();
        invoice.setOfflineSale(sale);
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setTotalAmount(sale.getTotalAmount());

        String uniqueInvoiceNumber = generateUniqueInvoiceNumber();
        invoice.setInvoiceNumber(uniqueInvoiceNumber);

        return invoiceRepo.save(invoice);
    }
	
	private String generateUniqueInvoiceNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomPart = (int) (Math.random() * 9000) + 1000;
        return "INV-" + datePart + "-" + randomPart;
    }

	@Override
	public Invoice getInvoiceByOrderId(Long orderId) {
		return invoiceRepo.findByOrderId(orderId);
	}

    @Override
    public Invoice getInvoiceByOfflineSaleId(Long offlineSaleId) {
        return invoiceRepo.findByOfflineSaleId(offlineSaleId);
    }

}
