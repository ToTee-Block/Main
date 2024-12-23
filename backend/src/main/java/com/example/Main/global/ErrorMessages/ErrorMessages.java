package com.example.Main.global.ErrorMessages;

public class ErrorMessages {

    // 게시글 관련 오류 메시지
    public static final String NOT_FOUND = "게시글을 찾을 수 없습니다.";
    public static final String NOT_YOUR_OWN = "본인만 수정/삭제할 수 있습니다.";
    public static final String NOT_EXIST = "게시글이 존재하지 않습니다.";
    public static final String NO_DRAFT = "임시 저장된 게시물이 없습니다.";
    public static final String ONLY_OWN_DRAFT = "본인만 임시 저장 게시글을 이어서 작성할 수 있습니다.";
    public static final String ID_MISMATCH = "댓글이 속한 게시글 번호가 일치하지 않습니다.";

    // 댓글 관련 오류 메시지
    public static final String COMMENT_NOT_FOUND = "댓글을 찾을 수 없습니다.";
    public static final String REPLY_NOT_FOUND = "대댓글을 찾을 수 없습니다.";
    public static final String REPLY_PARENT_COMMENT_NOT_FOUND = "부모 댓글을 찾을 수 없습니다.";
    public static final String REPLY_NO_USERS = "본인이 작성한 대댓글이 없습니다.";
    public static final String REPLY_ID_MISMATCH = "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.";
    public static final String REPLY_NOT_YOUR_OWN = "본인만 대댓글을 수정/삭제 할 수 있습니다.";
    public static final String INVALID_COMMENT_OPERATION = "대댓글 작성에 실패했습니다.";

    // 로그인 및 인증 관련 오류 메시지
    public static final String UNAUTHORIZED = "로그인 후 사용 가능합니다.";

    // 게시물 신고 관련 오류 메시지
    public static final String ALREADY_REPORTED = "이미 신고한 게시물입니다.";
    public static final String REPORT_NOT_FOUND = "신고를 찾을 수 없습니다.";
    public static final String REPORT_PROCESS_FAILED = "신고 처리 실패";
    public static final String INVALID_REPORT_STATUS = "잘못된 신고 상태입니다.";

    // 관리자 권한 오류 메시지
    public static final String ONLY_ADMIN = "관리자 권한이 없습니다.";
}
