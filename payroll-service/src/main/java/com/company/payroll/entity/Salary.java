package com.company.payroll.entity;

import com.company.payroll.enums.PayrollStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "salaries")
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Employee ID is required")
    @Positive(message = "Employee ID must be positive")
    @Column(nullable = false)
    private Long employeeId;
    
    @NotBlank(message = "Employee code is required")
    @Size(min = 3, max = 20, message = "Employee code must be between 3 and 20 characters")
    @Pattern(regexp = "^[A-Z0-9]+$", message = "Employee code must contain only uppercase letters and numbers")
    @Column(nullable = false)
    private String employeeCode;
    
    @NotNull(message = "Basic salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Basic salary must be positive")
    @DecimalMax(value = "1000000.0", message = "Basic salary cannot exceed 1,000,000")
    @Column(nullable = false)
    private Double basicSalary;
    
    @DecimalMin(value = "0.0", message = "Allowances cannot be negative")
    private Double allowances;
    
    @DecimalMin(value = "0.0", message = "Deductions cannot be negative")
    private Double deductions;
    
    @NotNull(message = "Net salary is required")
    @DecimalMin(value = "0.0", message = "Net salary cannot be negative")
    @Column(nullable = false)
    private Double netSalary;
    
    @NotNull(message = "Pay period is required")
    @PastOrPresent(message = "Pay period cannot be in the future")
    @Column(nullable = false)
    private LocalDate payPeriod;
    
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollStatus status = PayrollStatus.DRAFT;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Salary() {}

    public Salary(Long employeeId, String employeeCode, Double basicSalary, 
                  Double allowances, Double deductions, Double netSalary, LocalDate payPeriod) {
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.basicSalary = basicSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.netSalary = netSalary;
        this.payPeriod = payPeriod;
        this.status = PayrollStatus.DRAFT;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public Double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(Double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public Double getAllowances() {
        return allowances;
    }

    public void setAllowances(Double allowances) {
        this.allowances = allowances;
    }

    public Double getDeductions() {
        return deductions;
    }

    public void setDeductions(Double deductions) {
        this.deductions = deductions;
    }

    public Double getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(Double netSalary) {
        this.netSalary = netSalary;
    }

    public LocalDate getPayPeriod() {
        return payPeriod;
    }

    public void setPayPeriod(LocalDate payPeriod) {
        this.payPeriod = payPeriod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PayrollStatus getStatus() {
        return status;
    }

    public void setStatus(PayrollStatus status) {
        this.status = status;
    }

    // Getters and setters (generate using your IDE)
    
}