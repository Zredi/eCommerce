package com.agro.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OfflineSale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime saleDate;
    private BigDecimal totalAmount;
    private String customerName;
    private String customerPhone;
    private String paymentMethod;
    private BigDecimal gstPercentage;
    private BigDecimal gstAmount;
    private BigDecimal finalAmount;

    @OneToMany(mappedBy = "offlineSale", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OfflineSaleItem> items = new HashSet<>();

    @OneToOne(mappedBy = "offlineSale", cascade = CascadeType.ALL)
    private Invoice invoice;
}
