package com.example.Main.domain.notification.repository;

import com.example.Main.domain.Member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.domain.notification.entity.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByMemberOrderByCreatedAtDesc(Member member);
}
