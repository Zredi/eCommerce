package com.agro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Notification;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
	
	List<Notification> findByUserId(Long userId);

}
