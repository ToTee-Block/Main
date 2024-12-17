package com.example.Main.domain.notification.controller;

import com.example.Main.domain.notification.entity.Notification;
import com.example.Main.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class ApiV1NotificationController {
    private final NotificationService notificationService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("")
    public ResponseEntity<List<Notification>> getNotifications() {
        List<Notification> notifications = notificationService.getNotificationsForCurrentUser();
        return ResponseEntity.ok(notifications);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable("id") Long id) {
        try {
            boolean updated = notificationService.markAsRead(id);
            if (updated) {
                return ResponseEntity.ok("알림이 읽음으로 표시되었습니다.");
            } else {
                return ResponseEntity.status(404).body("알림을 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("알림을 읽음으로 표시하는 데 실패했습니다: " + e.getMessage());
        }
    }
}
