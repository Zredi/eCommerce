package com.agro.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.agro.model.Notification;
import com.agro.repository.NotificationRepo;
import com.agro.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
	
	private final NotificationRepo notificationRepo;

	@Override
	public void sendNotification(Long userId, String message) {
		Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .isRead(false)
                .timestamp(LocalDateTime.now())
                .build();
        notificationRepo.save(notification);
		
	}

	@Override
	public List<Notification> getNotifications(Long userId) {
		return notificationRepo.findByUserId(userId);
	}

	@Override
	public void markAsRead(Long notificationId) {
		Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepo.save(notification);
		
	}

	@Override
	public void deleteNotification(Long notificationId) {
		notificationRepo.deleteById(notificationId);
		
	}
	

}
