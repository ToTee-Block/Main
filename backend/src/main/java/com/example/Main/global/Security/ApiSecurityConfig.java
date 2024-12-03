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

                        // post 관련 API에 대한 권한 설정 추가
                        .requestMatchers(HttpMethod.GET, "/api/*/post/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/post/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/*/post/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/*/post/**").permitAll()

                        // QnA 관련 API에 대한 권한 설정 추가
                        .requestMatchers(HttpMethod.GET, "/api/*/qna/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/*/qna/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/*/qna/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/*/qna/**").permitAll()

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
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
