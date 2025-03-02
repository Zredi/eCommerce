package com.agro.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReturnDto {

    private Long id;
    private Long orderId;
    private Long userId;
    private String reason;
    private String status;
    private LocalDateTime requestDate;
}
