package com.example.Main.global.Security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ApiSecurityConfig {
    @Bean
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**")
                .authorizeRequests(
                        authorizeRequests -> authorizeRequests
                                .requestMatchers(HttpMethod.POST, "/api/*/members/login").permitAll() // 로그인은 누구나 가능, post 요청만 허용
                                .requestMatchers(HttpMethod.POST, "/api/*/members/join").permitAll() // 회원가입은 누구나 가능, post 요청만 허용
                                .requestMatchers(HttpMethod.GET, "/api/*/members/logout").permitAll() // 로그아웃은 누구나 가능, get 요청만 허용
                                .requestMatchers(HttpMethod.GET, "/api/*/members/me").permitAll() // 로그인된 사용자 정보 보기는 누구나 가능, get 요청만 허용
                                .requestMatchers(HttpMethod.PATCH, "/api/*/members/password").permitAll() // 비밀번호 변경은 누구나 가능, patch 요청만 허용
                                .requestMatchers("/api/*/members/**").permitAll()  // TODO: 테스트 시 Members에 대한 기능 모두 허용. 추후에 머지 시 삭제하고 수정할 것
                                .requestMatchers("/api/*/mentors/**").permitAll()  // TODO: 테스트 시 Mentors에 대한 기능 모두 허용. 추후에 머지 시 삭제하고 수정할 것
                                .anyRequest().authenticated()
                )
                .csrf(
                        csrf -> csrf
                                .disable()
                ) // csrf 토큰 끄기
                .httpBasic(
                        httpBasic -> httpBasic.disable()
                ) // httpBasic 로그인 방식 끄기
                .formLogin(
                        formLogin -> formLogin.disable()
                ) // 폼 로그인 방식 끄기
                .sessionManagement(
                        sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        return http.build();
    }
}
