package com.agro.service;

import java.util.List;

import com.agro.model.Notification;

public interface NotificationService {
	
	void sendNotification(Long userId, String message);
	
	List<Notification> getNotifications(Long userId);
	
	void markAsRead(Long notificationId);
	
	void deleteNotification(Long notificationId);
	
}
