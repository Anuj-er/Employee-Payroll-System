package com.company.payroll.controller;

import com.company.payroll.entity.Salary;
import com.company.payroll.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    // Create a new payroll record
    @PostMapping
    public ResponseEntity<Salary> generatePayroll(@RequestBody Salary salary) {
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
}