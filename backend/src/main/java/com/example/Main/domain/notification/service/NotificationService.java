package com.example.Main.domain.notification.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.notification.dto.NotificationDTO;
import com.example.Main.domain.notification.entity.Notification;
import com.example.Main.domain.notification.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    public void sendNotification(String userId, String message) {
        Member member = memberRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Notification notification = new Notification(member, message);
        notificationRepository.save(notification);

        messagingTemplate.convertAndSendToUser(
                userId,
                "/topic/notifications",
                message
        );
    }

    public void sendNotificationToAdmins(String message) {
        List<Member> admins = memberRepository.findByRole(MemberRole.ADMIN);

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        for (Member admin : admins) {
            notification.setMember(admin);
            notificationRepository.save(notification);
        }
    }

    public List<NotificationDTO> getNotificationsForCurrentUser() {
        Member currentUser = memberService.getCurrentUser();
        List<Notification> notifications = notificationRepository.findByMemberOrderByCreatedAtDesc(currentUser);

        return notifications.stream()
                .map(notification -> new NotificationDTO(
                        notification.getId(),
                        notification.getMessage(),
                        notification.isRead(),
                        notification.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
            return true;
        }
        return false;
    }
}
