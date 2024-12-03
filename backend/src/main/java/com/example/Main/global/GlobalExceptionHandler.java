package com.example.Main.global;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // 오류 메시지 목록 생성
        String errorMessage = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> {
                    // 필드 에러인 경우 필드명을 포함해서 반환
                    if (error instanceof FieldError) {
                        return ((FieldError) error).getDefaultMessage(); // 기본 메시지 (예: 제목은 필수 입력 항목입니다.)
                    }
                    return error.getDefaultMessage(); // 일반 오류 메시지
                })
                .findFirst()
                .orElse("입력 값이 잘못되었습니다."); // 기본 메시지

        // 단순 메시지만 포함하여 응답 반환
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(errorMessage));
    }

    // 오류 메시지를 담는 클래스 (응답 구조)
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
