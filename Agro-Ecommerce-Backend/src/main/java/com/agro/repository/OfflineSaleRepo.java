package com.agro.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.OfflineSale;

public interface OfflineSaleRepo extends JpaRepository<OfflineSale, Long> {
    List<OfflineSale> findBySaleDateBetween(LocalDateTime startDate, LocalDateTime endDate);

}
