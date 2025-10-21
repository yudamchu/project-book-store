package it.back.back_app.config;

import it.back.back_app.security.filter.*;
import it.back.back_app.security.jwt.JwtUtils;
import it.back.back_app.security.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;
    private final AuthenticationConfiguration authenticationConfiguration;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        LoginFilter loginFilter = new LoginFilter(authenticationManager(), jwtUtils);
        loginFilter.setFilterProcessesUrl("/api/v1/login");

        http
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                    //비회원(모두 접근 가능) 
                    .requestMatchers(
            "/api/v1/signup",
                        "/api/v1/login",
                        "/api/v1/check-username",
                        "/files/**"
                    ).permitAll()

                    // 도서, 카테고리, 리뷰(조회), 이미지(조회), 중고도서(조회)
                    .requestMatchers(HttpMethod.GET,
            "/api/v1/books/**",
                        "/api/v1/categories/**",
                        "/api/v1/book-images/**",
                        "/api/v1/book-reviews/**",
                        "/api/v1/used-books/**",
                        "/api/v1/used-book-images/**"
                    ).permitAll()

                    //로그인 사용자 접근 가능 (USER, ADMIN 공통) 
                    // 회원 정보, 배송지, 로그아웃 등
                    .requestMatchers(
            "/api/v1/member/**",
                        "/api/v1/addresses/**",
                        "/api/v1/logout",
                        "/api/v1/users/**"
                    ).authenticated()

                    .requestMatchers("/api/v1/points/**").authenticated()
                    .requestMatchers("/api/v1/payments/**").authenticated()
                    .requestMatchers("/api/v1/orders/**").authenticated()

                    // 장바구니 관련 (USER, ADMIN 공통)
                    .requestMatchers("/api/v1/cart/**").hasAnyRole("USER", "ADMIN")

                    // 중고도서 등록/수정/삭제 (USER, ADMIN)
                    .requestMatchers(HttpMethod.POST, "/api/v1/used-books/**").hasAnyRole("USER", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/used-books/**").hasAnyRole("USER", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/used-books/**").hasAnyRole("USER", "ADMIN")

                     // 중고 도서 이미지 등록/수정/삭제 (USER, ADMIN)
                    .requestMatchers(HttpMethod.POST, "/api/v1/used-book-images/**").hasAnyRole("USER", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/used-book-images/**").hasAnyRole("USER", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/used-book-images/**").hasAnyRole("USER", "ADMIN")


                    // 도서 리뷰 등록은 USER만, 수정/삭제는 로그인한 사용자면 가능
                    .requestMatchers(HttpMethod.POST, "/api/v1/book-reviews/**").hasRole("USER")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/book-reviews/**").authenticated()
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/book-reviews/**").authenticated()


                    // 관리자 전용 (ADMIN 전용) 
                    // 도서 이미지 관리 (등록/수정/삭제)
                    .requestMatchers(HttpMethod.POST, "/api/v1/book-images/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/book-images/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/book-images/**").hasRole("ADMIN")


                    //그 외 모든 요청 
                    .anyRequest().authenticated()
            )

            // CORS 허용 (프론트 연결)
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:4000", "http://localhost:3000"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            // 커스텀 필터 등록
            .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(new JWTFilter(jwtUtils, customUserDetailsService),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
