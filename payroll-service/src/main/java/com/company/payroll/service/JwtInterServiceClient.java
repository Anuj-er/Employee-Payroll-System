package com.company.payroll.service;

import com.company.payroll.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
public class JwtInterServiceClient {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${employee.service.auth.username:admin}")
    private String adminUsername;

    @Value("${employee.service.auth.role:ADMIN}")
    private String adminRole;

    /**
     * Gets a JWT token for inter-service communication
     */
    public String getInterServiceJwtToken() {
        try {
            // Create a UserDetails object for the admin user
            UserDetails adminUser = User.builder()
                    .username(adminUsername)
                    .password("") // Password not needed for token generation
                    .authorities(Arrays.asList(new SimpleGrantedAuthority("ROLE_" + adminRole)))
                    .build();

            // Generate JWT token
            return jwtUtil.generateToken(adminUser);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate inter-service JWT token", e);
        }
    }

    /**
     * Creates HTTP headers with JWT authorization for inter-service calls
     */
    public HttpHeaders createJwtHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String token = getInterServiceJwtToken();
        headers.setBearerAuth(token);
        return headers;
    }

    /**
     * Makes a GET request to another service with JWT authentication
     */
    public <T> ResponseEntity<T> getWithJwt(String url, Class<T> responseType) {
        try {
            HttpHeaders headers = createJwtHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            return restTemplate.exchange(url, HttpMethod.GET, entity, responseType);
        } catch (Exception e) {
            throw new RuntimeException("Failed to make authenticated GET request to: " + url, e);
        }
    }

    /**
     * Makes a POST request to another service with JWT authentication
     */
    public <T, R> ResponseEntity<R> postWithJwt(String url, T requestBody, Class<R> responseType) {
        try {
            HttpHeaders headers = createJwtHeaders();
            HttpEntity<T> entity = new HttpEntity<>(requestBody, headers);
            
            return restTemplate.exchange(url, HttpMethod.POST, entity, responseType);
        } catch (Exception e) {
            throw new RuntimeException("Failed to make authenticated POST request to: " + url, e);
        }
    }

    /**
     * Makes a DELETE request to another service with JWT authentication
     */
    public ResponseEntity<Void> deleteWithJwt(String url) {
        try {
            HttpHeaders headers = createJwtHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            return restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to make authenticated DELETE request to: " + url, e);
        }
    }
}
