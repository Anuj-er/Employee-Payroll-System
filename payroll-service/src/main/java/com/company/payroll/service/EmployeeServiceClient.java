package com.company.payroll.service;

import com.company.payroll.dto.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceClient {

    @Autowired
    private JwtInterServiceClient jwtInterServiceClient;

    // URL of the employee-service (can be set in application.properties)
    @Value("${employee.service.url:http://localhost:8081/api/employees}")
    private String employeeServiceUrl;

    public EmployeeDTO getEmployeeByCode(String employeeCode) {
        try {
            String url = employeeServiceUrl + "/code/" + employeeCode;

            ResponseEntity<EmployeeDTO> response = jwtInterServiceClient.getWithJwt(url, EmployeeDTO.class);

            if (response.getBody() == null) {
                throw new RuntimeException("Employee service returned null response for employee code: " + employeeCode);
            }
            
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch employee with code: " + employeeCode + ". Error: " + e.getMessage(), e);
        }
    }
}