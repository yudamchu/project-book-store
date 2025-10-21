package it.back.back_app.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    private final String SECRET_KEY = "aHR0cHM6Ly95dWRhbS1zdXBlci1zZWN1cmUta2V5LTIwMjUtand0LWF1dGgtcHJvamVjdC1rZXk=";
    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username) 
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject(); 
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
