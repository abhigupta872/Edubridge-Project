package com.edubridge.service;

import com.edubridge.dto.NotificationDto;
import com.edubridge.entity.Notification;
import com.edubridge.entity.User;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.NotificationRepository;
import com.edubridge.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public NotificationDto sendNotification(Long userId, String message, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);

        // Simulate Email Dispatching
        logger.info("[EMAIL SIMULATION ALERT] To: {} | Type: {} | Message: {}", user.getEmail(), type, message);
        System.out.println(">>> [EMAIL SENT] To: " + user.getEmail() + " | Body: " + message);

        return mapToDto(saved);
    }

    @Override
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }

    private NotificationDto mapToDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .message(n.getMessage())
                .read(n.isRead())
                .type(n.getType())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
