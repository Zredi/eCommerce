package com.agro.controller;

import com.agro.dto.OfflineSaleDto;
import com.agro.model.OfflineSale;
import com.agro.response.ApiResponse;
import com.agro.service.OfflineSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/offline-sales")
public class OfflineSaleController {

    private final OfflineSaleService offlineSaleService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createSale(@RequestBody OfflineSaleDto saleDto) {
        try {
            OfflineSale sale = offlineSaleService.createSale(saleDto);
            OfflineSaleDto responseDto = offlineSaleService.convertToDto(sale);
            return ResponseEntity.ok(new ApiResponse("Sale created successfully!", responseDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSale(@PathVariable Long id) {
        try {
            OfflineSale sale = offlineSaleService.getSaleById(id);
            OfflineSaleDto saleDto = offlineSaleService.convertToDto(sale);
            return ResponseEntity.ok(new ApiResponse("Success", saleDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllSales() {
        try {
            List<OfflineSale> sales = offlineSaleService.getAllSales();
            List<OfflineSaleDto> saleDtos = sales.stream()
                    .map(offlineSaleService::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse("Success", saleDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Error fetching sales", null));
        }
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<ApiResponse> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<OfflineSale> sales = offlineSaleService.getSalesByDateRange(startDate, endDate);
            List<OfflineSaleDto> saleDtos = sales.stream()
                    .map(offlineSaleService::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse("Success", saleDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), null));
        }
    }
} 