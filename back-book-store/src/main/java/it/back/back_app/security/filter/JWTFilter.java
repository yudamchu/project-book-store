package it.back.back_app.security.filter;

import it.back.back_app.security.jwt.JwtUtils;
import it.back.back_app.security.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // ✅ [1] 요청 헤더 로그 찍기
        System.out.println("🔹 [JWTFilter] Authorization header = " + header);
        System.out.println("🔹 [JWTFilter] Request URI = " + request.getRequestURI());

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            // ✅ [2] 토큰 유효성 검증 로그
            System.out.println("🔹 [JWTFilter] Extracted Token = " + token);

            if (jwtUtils.validateToken(token)) {
                String username = jwtUtils.getUsernameFromToken(token);
                System.out.println("✅ [JWTFilter] Token valid. username = " + username);

                var userDetails = userDetailsService.loadUserByUsername(username);
                var auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // ✅ [3] SecurityContext 등록 전후 확인
                System.out.println("🔸 [Before Set] Authentication = " + SecurityContextHolder.getContext().getAuthentication());
                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("✅ [After Set] Authentication = " + SecurityContextHolder.getContext().getAuthentication());
            } else {
                System.out.println("❌ [JWTFilter] Token validation failed");
            }
        } else {
            System.out.println("⚠️ [JWTFilter] Authorization header missing or invalid format");
        }

        filterChain.doFilter(request, response);
    }
}
