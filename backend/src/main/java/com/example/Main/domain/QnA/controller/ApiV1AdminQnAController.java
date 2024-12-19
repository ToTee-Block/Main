package com.example.Main.domain.QnA.controller;

import com.example.Main.domain.QnA.dto.QnADTO;
import com.example.Main.domain.QnA.dto.response.QnAResponse;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.domain.notification.service.NotificationService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/admin/qnas")
public class ApiV1AdminQnAController {
    private final QnAService qnAService;
    private final NotificationService notificationService;

    // 관리자용 게시글 삭제
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public RsData<QnAResponse> deleteQnAByAdmin(@PathVariable("id") Long id, @AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String role = loggedInUser.getAuthorities().toString();
        if (!role.contains("ROLE_ADMIN")) {
            return RsData.of("403", ErrorMessages.ONLY_ADMIN, null);
        }

        QnA qnA = this.qnAService.getQnA(id);

        if (qnA == null || qnA.getIsDraft()) {
            return RsData.of("404", "%d 번 QnA 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        this.qnAService.deleteQnAByAdmin(id);

        // QnA 작성자에게 삭제 알림 전송
        notificationService.sendNotification(
                String.valueOf(qnA.getAuthor().getId()),
                "관리자에 의해 '%s'가 삭제되었습니다.".formatted(qnA.getSubject())
        );

        // 관리자에게 알림 전송
        notificationService.sendNotificationToAdmins(
                "관리자가 '%s'를 삭제했습니다.".formatted(qnA.getSubject())
        );

        QnADTO qnADTO = new QnADTO(qnA);
        return RsData.of("200", "%d 번 QnA 삭제 성공 (관리자 삭제)".formatted(id), new QnAResponse(qnADTO));
    }
}
