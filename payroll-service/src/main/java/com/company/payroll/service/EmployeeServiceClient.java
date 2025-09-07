package com.company.payroll.service;

import com.company.payroll.dto.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Base64;

@Service
public class EmployeeServiceClient {

    @Autowired
    private RestTemplate restTemplate;

    // URL of the employee-service (can be set in application.properties)
    @Value("${employee.service.url:http://localhost:8081/api/employees}")
    private String employeeServiceUrl;

    public EmployeeDTO getEmployeeByCode(String employeeCode) {
        try {
            String url = employeeServiceUrl + "/code/" + employeeCode;

            // Set up Basic Auth header for employee-service
            HttpHeaders headers = new HttpHeaders();
            String auth = "admin:admin123"; // Use the credentials for employee-service
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes());
            String authHeader = "Basic " + new String(encodedAuth);
            headers.set("Authorization", authHeader);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<EmployeeDTO> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, EmployeeDTO.class);

            if (response.getBody() == null) {
                throw new RuntimeException("Employee service returned null response for employee code: " + employeeCode);
            }
            
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch employee with code: " + employeeCode + ". Error: " + e.getMessage(), e);
        }
    }
}