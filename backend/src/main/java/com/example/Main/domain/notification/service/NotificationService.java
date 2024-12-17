package com.example.Main.domain.notification.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.notification.entity.Notification;
import com.example.Main.domain.notification.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    // 관리자에게 알림 전송 (중복 저장 방지)
    public void sendNotificationToAdmins(String message) {
        List<Member> admins = memberRepository.findByRole(MemberRole.ADMIN);

        // 하나의 알림만 생성하여 관리자를 설정 후 저장
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        for (Member admin : admins) {
            notification.setMember(admin); // 각 관리자에 대해 멤버 설정
            notificationRepository.save(notification); // 알림 저장
        }
    }

    // 특정 사용자에게 알림을 전송하는 메서드
    public void sendNotification(String userId, String message) {
        Member member = memberRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Notification notification = new Notification(member, message);
        notificationRepository.save(notification); // 사용자 정보와 함께 저장

        messagingTemplate.convertAndSendToUser(
                userId,
                "/topic/notifications",
                message
        );
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

    public List<Notification> getNotificationsForCurrentUser() {
        Member currentUser = memberService.getCurrentUser();
        return notificationRepository.findByMemberOrderByCreatedAtDesc(currentUser);
    }
}
