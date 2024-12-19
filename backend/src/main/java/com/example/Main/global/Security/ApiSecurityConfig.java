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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ApiSecurityConfig {

    private final JwtAuthorizationFilter jwtAuthorizationFilter;

    @Bean
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**")
                /*
                     .requestionMatchers(허용하는 요청 method, 허용되는 URL주소).허용 범주()
                     관리자 관련 기능은 "ADMIN" 권한만 접근 가능
                 */
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/*/members/join").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/members/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/members/code/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/*/members/logout").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/*/members/me").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/*/members/password").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/*/members/profile").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/*/members/delete/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/mentors/registration").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/*/mentors/profile/**").permitAll()
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // post 관련 API에 대한 권한 설정
                        .requestMatchers(HttpMethod.GET, "/api/*/posts/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/posts/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/*/posts/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/*/posts/**").authenticated()

                        // QnA 관련 API에 대한 권한 설정
                        .requestMatchers(HttpMethod.GET, "/api/*/qnas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/qnas/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/*/qnas/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/*/qnas/**").authenticated()

                        // 댓글 관련 API에 대한 권한 설정
                        .requestMatchers(HttpMethod.GET, "/api/*/comments/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/comments/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/*/comments/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/*/comments/**").authenticated()

                        // 기술스택 관련 API에 대한 권한 설정
                        .requestMatchers(HttpMethod.GET, "/api/*/techStacks/**").permitAll()

                        // 신고 관련 API에 대한 권한 설정
                        .requestMatchers(HttpMethod.GET, "/api/*/reports/**").permitAll()

                        // 알림 관련 API에 대한 권한 설정 추가
                        .requestMatchers(HttpMethod.GET, "api/*/notifications/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "api/*/notifications/**").permitAll()

                        // 관리자만 접근 가능한 API
                        .requestMatchers(HttpMethod.GET, "/api/*/post/**/report/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/*/post/**/report/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
