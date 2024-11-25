package com.example.Main.global.Security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ApiSecurityConfig {

    private final JwtAuthorizationFilter jwtAuthorizationFilter;  // jwtAuthorizationFilter 주입

    @Bean
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**")
                .authorizeRequests(
                        authorizeRequests -> authorizeRequests
                                /*
                                    .requestionMatchers(허용하는 요청 method, 허용되는 URL주소).허용 범주()
                                    관리자 관련 기능은 "ADMIN" 권한만 접근 가능
                                */
                                .requestMatchers(HttpMethod.POST, "/api/*/members/join").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/*/members/login").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/*/members/code/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/*/members/logout").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/*/members/me").permitAll()
                                .requestMatchers(HttpMethod.PATCH, "/api/*/members/password").permitAll()
                                .requestMatchers(HttpMethod.PATCH, "/api/*/members/profile").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/api/*/members/delete/**").permitAll()
                                .requestMatchers("/api/*/admin/**").hasRole("ADMIN")
                                .anyRequest().authenticated()
                )
                .csrf(
                        csrf -> csrf.disable()
                ) // csrf 토큰 끄기
                .httpBasic(
                        httpBasic -> httpBasic.disable()
                ) // httpBasic 로그인 방식 끄기
                .formLogin(
                        formLogin -> formLogin.disable()
                ) // 폼 로그인 방식 끄기
                .sessionManagement(
                        sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ) // 세션 사용 안 함 (JWT 사용)
                .addFilterBefore(
                        jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class
                ); // JwtAuthenticationFilter 등록, UPAF를 돌기 전에 등록된 필터를 먼저 진행함
        return http.build();
    }
}
