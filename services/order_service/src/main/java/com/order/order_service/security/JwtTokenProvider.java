package com.order.order_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.security.Key;
import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Base64;

@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationInMs;
    
    private Key signingKey;
    
    @PostConstruct
    public void init() {
        // Make sure the secret key is properly padded for Base64 decoding
        String paddedSecret = jwtSecret;
        while (paddedSecret.length() % 4 != 0) {
            paddedSecret += "=";
        }
        
        try {
            // Use the secret from properties but ensure it's properly encoded
            byte[] keyBytes = Base64.getDecoder().decode(paddedSecret);
            signingKey = Keys.hmacShaKeyFor(keyBytes);
            logger.info("JWT signing key initialized using configured secret");
        } catch (IllegalArgumentException e) {
            // Fallback: If the secret isn't valid Base64, use it directly
            logger.warn("Invalid Base64 in jwt.secret, using raw bytes: {}", e.getMessage());
            signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            logger.error("Could not get username from token: {}", e.getMessage());
            return null;
        }
    }

    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("userId", String.class);
        } catch (Exception e) {
            logger.error("Could not get userId from token: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (Exception ex) {
            logger.error("Could not validate token: {}", ex.getMessage());
        }
        return false;
    }
}