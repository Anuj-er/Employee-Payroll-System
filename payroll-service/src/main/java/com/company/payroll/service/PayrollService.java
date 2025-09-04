package com.company.payroll.service;

import com.company.payroll.dto.EmployeeDTO;
import com.company.payroll.entity.Salary;
import com.company.payroll.repository.SalaryRepository;
import com.company.payroll.repository.SalaryJdbcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PayrollService {

    private final SalaryRepository salaryRepository;
    private final EmployeeServiceClient employeeServiceClient;
    private final SalaryJdbcRepository salaryJdbcRepository;

    @Autowired
    public PayrollService(
        SalaryRepository salaryRepository,
        EmployeeServiceClient employeeServiceClient,
        SalaryJdbcRepository salaryJdbcRepository
    ) {
        this.salaryRepository = salaryRepository;
        this.employeeServiceClient = employeeServiceClient;
        this.salaryJdbcRepository = salaryJdbcRepository;
    }

    public Salary generatePayroll(Salary salary) {
        // Step 1: Fetch employee details from employee-service
        EmployeeDTO employee = employeeServiceClient.getEmployeeByCode(salary.getEmployeeCode());

        // Step 2: Use employee data for payroll calculation
        if (employee == null) {
            throw new RuntimeException("Employee not found for code: " + salary.getEmployeeCode());
        }

        // Use employee's basic salary from employee-service
        salary.setBasicSalary(employee.getBasicSalary());

        // Calculate allowances and deductions (example logic)
        double allowances = salary.getBasicSalary() * 0.2; // 20% of basic
        double deductions = salary.getBasicSalary() * 0.1; // 10% of basic

        salary.setAllowances(allowances);
        salary.setDeductions(deductions);

        // Calculate net salary
        salary.setNetSalary(salary.getBasicSalary() + allowances - deductions);

        // Set createdAt and payPeriod if needed
        salary.setCreatedAt(java.time.LocalDateTime.now());
        // salary.setPayPeriod(...); // set as needed

        // Step 3: Save the payroll record
        return salaryRepository.save(salary);
    }

    // Get all payroll records for an employee (Hibernate/JPA)
    public List<Salary> getPayrollByEmployeeId(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId);
    }

    // Get all payroll records for an employee (JDBC)
    public List<Salary> getPayrollByEmployeeIdJdbc(Long employeeId) {
        return salaryJdbcRepository.findSalariesByEmployeeId(employeeId);
    }
    // Get all payroll records
    public List<Salary> getAllPayrolls() {
        return salaryRepository.findAll();
    }
    
    @Transactional
    public void deleteSalariesByEmployeeCode(String employeeCode) {
        salaryRepository.deleteByEmployeeCode(employeeCode);
    }
}