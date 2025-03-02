 package com.agro.model;

 import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
 import jakarta.persistence.GeneratedValue;
 import jakarta.persistence.GenerationType;
 import jakarta.persistence.Id;
 import jakarta.persistence.JoinColumn;
 import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

 @Getter
 @Setter
 @AllArgsConstructor
 @NoArgsConstructor
 @Entity
 @Table(name = "invoices")
 public class Invoice {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    
	    @JsonIgnore
	    @OneToOne
	    @JoinColumn(name = "order_id")
	    private Order order;

		@JsonIgnore
        @OneToOne
        @JoinColumn(name = "offline_sale_id")
        private OfflineSale offlineSale;

	    @Column(nullable = false, unique = true)
	    private String invoiceNumber;

	    private LocalDate invoiceDate;

	    private BigDecimal totalAmount;               
             
 }
