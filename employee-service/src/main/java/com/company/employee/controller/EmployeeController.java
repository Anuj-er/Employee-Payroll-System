package com.company.employee.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.company.employee.entity.Employee;
import com.company.employee.service.EmployeeService;

import org.springframework.http.HttpHeaders;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${payroll.service.url}")
    private String payrollServiceUrl;

    // Create a new employee
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee savedEmployee = employeeService.saveEmployee(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Employee>> createEmployees(@RequestBody List<Employee> employees) {
        List<Employee> saved = employees.stream()
            .map(employeeService::saveEmployee)
            .toList();
        return ResponseEntity.ok(saved);
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // Get employee by employee code
    @GetMapping("/code/{employeeCode}")
    public ResponseEntity<Employee> getEmployeeByEmployeeCode(@PathVariable String employeeCode) {
        Optional<Employee> employee = employeeService.getEmployeeByEmployeeCode(employeeCode);
        return employee.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // Get employees by department
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    // Delete employee by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // Cascade delete: delete employee and their salaries
    @DeleteMapping("/cascade/{employeeCode}")
    public ResponseEntity<String> deleteEmployeeAndSalaries(@PathVariable String employeeCode) {
        Optional<Employee> employeeOpt = employeeService.getEmployeeByEmployeeCode(employeeCode);
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Employee employee = employeeOpt.get();
        Long id = employee.getId();

        // Call payroll-service to delete salaries by employeeCode
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("hr", "hr123"); // Replace with actual username and password
        HttpEntity<String> entity = new HttpEntity<>(headers);

        restTemplate.exchange(
            "http://localhost:8082/api/payroll/salaries/by-employee/" + employeeCode,
            HttpMethod.DELETE,
            entity,
            Void.class
        );

        // Delete employee
        employeeService.deleteEmployee(id);
        

        return ResponseEntity.ok("Employee and related salaries deleted successfully.");
    }
}
