// package com.agro.model;

// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;

// import com.agro.model.enums.PaymentStatus;

// import jakarta.persistence.Entity;
// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;

// @Data
// @NoArgsConstructor
// @Entity
// @Table(name = "payments")
// public class Payment {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;                   

//     private Double amount;              

//     private String paymentMethod; 
    
//     private LocalDateTime paymentDate;    
    
//     @Enumerated(EnumType.STRING)
//     private PaymentStatus paymentStatus;              

//     @ManyToOne
//     @JoinColumn(name = "order_id")     
//     private Order order;              
// }

