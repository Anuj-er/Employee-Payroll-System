package com.company.payroll.controller;

import com.company.payroll.entity.Salary;
import com.company.payroll.enums.PayrollStatus;
import com.company.payroll.service.PayrollService;
import com.company.payroll.service.PayrollSchedulerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private PayrollSchedulerService payrollSchedulerService;

    // Create a new payroll record
    @PostMapping
    public ResponseEntity<Salary> generatePayroll(@Valid @RequestBody Salary salary) {
        Salary saved = payrollService.generatePayroll(salary);
        return ResponseEntity.ok(saved);
    }
    // Get all payroll records
    @GetMapping
    public ResponseEntity<List<Salary>> getAllPayrolls() {
        List<Salary> salaries = payrollService.getAllPayrolls();
        return ResponseEntity.ok(salaries);
    }

    // Get all payroll records for an employee (Hibernate/JPA)
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Salary>> getPayrollByEmployeeId(@PathVariable Long employeeId) {
        List<Salary> salaries = payrollService.getPayrollByEmployeeId(employeeId);
        return ResponseEntity.ok(salaries);
    }

    // Get all payroll records for an employee (JDBC)
    @GetMapping("/employee/{employeeId}/jdbc")
    public ResponseEntity<List<Salary>> getPayrollByEmployeeIdJdbc(@PathVariable Long employeeId) {
        List<Salary> salaries = payrollService.getPayrollByEmployeeIdJdbc(employeeId);
        return ResponseEntity.ok(salaries);
    }
    // Delete all salary records for an employee by employeeCode (for cascade delete)
    @DeleteMapping("/salaries/by-employee/{employeeCode}")
    public ResponseEntity<String> deleteSalariesByEmployeeCode(@PathVariable String employeeCode) {
        payrollService.deleteSalariesByEmployeeCode(employeeCode);
        return ResponseEntity.ok("Salaries deleted for employee: " + employeeCode);
    }

    // Manual bulk payroll generation for all employees
    @PostMapping("/bulk")
    public ResponseEntity<String> generateBulkPayroll() {
        String result = payrollSchedulerService.generateBulkPayroll();
        return ResponseEntity.ok(result);
    }
    
    // Status management endpoints
    @PutMapping("/{salaryId}/status/{status}")
    public ResponseEntity<Salary> updatePayrollStatus(@PathVariable Long salaryId, @PathVariable PayrollStatus status) {
        Salary updatedSalary = payrollService.updatePayrollStatus(salaryId, status);
        return ResponseEntity.ok(updatedSalary);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Salary>> getPayrollsByStatus(@PathVariable PayrollStatus status) {
        List<Salary> payrolls = payrollService.getPayrollsByStatus(status);
        return ResponseEntity.ok(payrolls);
    }
    
    @GetMapping("/employee/{employeeCode}/status/{status}")
    public ResponseEntity<List<Salary>> getPayrollsByEmployeeAndStatus(
            @PathVariable String employeeCode, 
            @PathVariable PayrollStatus status) {
        List<Salary> payrolls = payrollService.getPayrollsByEmployeeAndStatus(employeeCode, status);
        return ResponseEntity.ok(payrolls);
    }
}