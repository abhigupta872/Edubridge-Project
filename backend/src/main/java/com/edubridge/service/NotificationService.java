package com.edubridge.service;

import com.edubridge.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    NotificationDto sendNotification(Long userId, String message, String type);
    List<NotificationDto> getUserNotifications(Long userId);
    void markAsRead(Long notificationId);
    long getUnreadCount(Long userId);
}
