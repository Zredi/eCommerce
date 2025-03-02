package com.agro.service;


import com.agro.model.Invoice;

public interface InvoiceService {

	Invoice generateInvoice(Long orderId);
	
	Invoice getInvoiceByOrderId(Long orderId);

	Invoice generateOfflineInvoice(Long offlineSaleId);

	Invoice getInvoiceByOfflineSaleId(Long offlineSaleId);


}
