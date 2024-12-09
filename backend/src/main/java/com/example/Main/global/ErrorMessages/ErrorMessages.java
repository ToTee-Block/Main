package com.example.Main.global.ErrorMessages;

public class ErrorMessages {

    // 게시글 관련 오류 메시지
    public static final String POST_NOT_FOUND = "게시글을 찾을 수 없습니다.";
    public static final String POST_ID_MISMATCH = "댓글이 속한 게시글 번호가 일치하지 않습니다.";
    public static final String POST_NOT_EXIST = "게시글이 존재하지 않습니다.";

    // 댓글 관련 오류 메시지
    public static final String COMMENT_NOT_FOUND = "댓글을 찾을 수 없습니다.";
    public static final String COMMENT_ID_MISMATCH = "댓글이 존재하지 않거나, 게시글과 일치하지 않습니다.";
    public static final String COMMENT_HAS_REPLIES = "대댓글이 달린 댓글은 삭제할 수 없습니다.";

    // 대댓글 관련 오류 메시지
    public static final String REPLY_NOT_FOUND = "대댓글을 찾을 수 없습니다.";
    public static final String REPLY_PARENT_COMMENT_NOT_FOUND = "부모 댓글을 찾을 수 없습니다.";
    public static final String REPLY_NO_USERS = "본인이 작성한 대댓글이 없습니다.";
    public static final String REPLY_ID_MISMATCH = "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.";
    public static final String REPLY_CANNOT_BE_MODIFIED = "본인만 대댓글을 수정할 수 있습니다.";
    public static final String REPLY_CANNOT_BE_DELETED = "본인만 대댓글을 삭제할 수 있습니다.";

    // 로그인 및 인증 관련 오류 메시지
    public static final String UNAUTHORIZED = "로그인 후 사용 가능합니다.";
    public static final String FORBIDDEN = "본인만 댓글을 수정하거나 삭제할 수 있습니다.";

    // 기타 공통 오류 메시지
    public static final String INVALID_COMMENT_OPERATION = "대댓글 작성에 실패했습니다.";
    public static final String NO_COMMENTS = "댓글이 없습니다.";
    public static final String NO_REPLIES = "대댓글이 없습니다.";
    public static final String QNA_NOT_FOUND = "QnA를 찾을 수 없습니다.";
    public static final String QNA_ID_MISMATCH = "QnA와 일치하지 않는 댓글입니다.";
    public static final String COMMENT_NOT_BELONG_TO_QNA = "댓글이 해당 QnA와 일치하지 않습니다.";
}
