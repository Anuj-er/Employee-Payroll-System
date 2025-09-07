package com.company.payroll.service;

import com.company.payroll.dto.EmployeeDTO;
import com.company.payroll.entity.Salary;
import com.company.payroll.enums.PayrollStatus;
import com.company.payroll.repository.SalaryRepository;
import com.company.payroll.repository.SalaryJdbcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
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
        // Step 1: Basic validation (only check required fields)
        if (salary.getEmployeeCode() == null || salary.getEmployeeCode().trim().isEmpty()) {
            throw new RuntimeException("Employee code is required");
        }
        
        // Check for duplicate payroll
        if (salary.getPayPeriod() != null && salary.getEmployeeCode() != null) {
            if (salaryRepository.existsByEmployeeCodeAndPayPeriod(salary.getEmployeeCode(), salary.getPayPeriod())) {
                throw new RuntimeException("Payroll already exists for employee " + salary.getEmployeeCode() + " for period " + salary.getPayPeriod());
            }
        }
        
        // Step 2: Fetch employee details from employee-service
        EmployeeDTO employee = employeeServiceClient.getEmployeeByCode(salary.getEmployeeCode());

        // Step 3: Use employee data for payroll calculation
        if (employee == null) {
            throw new RuntimeException("Employee not found for code: " + salary.getEmployeeCode());
        }

        // Set employee ID if not already set
        if (salary.getEmployeeId() == null) {
            salary.setEmployeeId(employee.getId());
        }

        // Use employee's basic salary from employee-service only if not provided
        if (salary.getBasicSalary() == null) {
            salary.setBasicSalary(employee.getBasicSalary());
        }

        // Calculate allowances and deductions (example logic)
        if (salary.getAllowances() == null) {
            double allowances = salary.getBasicSalary() * 0.2; // 20% of basic
            salary.setAllowances(allowances);
        }
        
        if (salary.getDeductions() == null) {
            double deductions = salary.getBasicSalary() * 0.1; // 10% of basic
            salary.setDeductions(deductions);
        }

        // Calculate net salary
        salary.setNetSalary(salary.getBasicSalary() + salary.getAllowances() - salary.getDeductions());

        // Set createdAt and payPeriod if needed
        salary.setCreatedAt(java.time.LocalDateTime.now());
        if (salary.getPayPeriod() == null) {
            salary.setPayPeriod(java.time.LocalDate.now().withDayOfMonth(1)); // First day of current month
        }
        
        // Step 4: Additional business logic validation (after all calculations)
        validateSalaryData(salary);

        // Step 5: Save the payroll record
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
    
    // Status management methods
    public List<Salary> getPayrollsByStatus(PayrollStatus status) {
        return salaryRepository.findByStatus(status);
    }
    
    public Salary updatePayrollStatus(Long salaryId, PayrollStatus newStatus) {
        Optional<Salary> salaryOpt = salaryRepository.findById(salaryId);
        if (salaryOpt.isPresent()) {
            Salary salary = salaryOpt.get();
            salary.setStatus(newStatus);
            return salaryRepository.save(salary);
        } else {
            throw new RuntimeException("Salary record not found with ID: " + salaryId);
        }
    }
    
    public List<Salary> getPayrollsByEmployeeAndStatus(String employeeCode, PayrollStatus status) {
        return salaryRepository.findByEmployeeCodeAndStatus(employeeCode, status);
    }
    
    // Business logic validation
    private void validateSalaryData(Salary salary) {
        // Validate pay period is not too far in the past (e.g., not older than 2 years)
        if (salary.getPayPeriod() != null) {
            java.time.LocalDate twoYearsAgo = java.time.LocalDate.now().minusYears(2);
            if (salary.getPayPeriod().isBefore(twoYearsAgo)) {
                throw new RuntimeException("Pay period cannot be older than 2 years");
            }
        }
        
        // Validate salary components consistency
        if (salary.getBasicSalary() != null && salary.getAllowances() != null && salary.getDeductions() != null) {
            double calculatedNet = salary.getBasicSalary() + salary.getAllowances() - salary.getDeductions();
            if (salary.getNetSalary() != null && Math.abs(salary.getNetSalary() - calculatedNet) > 0.01) {
                throw new RuntimeException("Net salary calculation is incorrect. Expected: " + calculatedNet + ", but got: " + salary.getNetSalary());
            }
        }
        
        // Validate allowances don't exceed basic salary by more than 100%
        if (salary.getBasicSalary() != null && salary.getAllowances() != null) {
            if (salary.getAllowances() > salary.getBasicSalary()) {
                throw new RuntimeException("Allowances cannot exceed basic salary");
            }
        }
        
        // Validate deductions don't exceed total of basic salary + allowances
        if (salary.getBasicSalary() != null && salary.getAllowances() != null && salary.getDeductions() != null) {
            double totalEarnings = salary.getBasicSalary() + salary.getAllowances();
            if (salary.getDeductions() > totalEarnings) {
                throw new RuntimeException("Deductions cannot exceed total earnings (basic + allowances)");
            }
        }
    }
}