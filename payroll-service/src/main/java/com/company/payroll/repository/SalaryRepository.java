package com.company.payroll.repository;

import com.company.payroll.entity.Salary;
import com.company.payroll.enums.PayrollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    List<Salary> findByEmployeeId(Long employeeId);
    List<Salary> findByEmployeeCode(String employeeCode);
    void deleteByEmployeeCode(String employeeCode);
    
    // Check if payroll already exists for employee in specific month
    boolean existsByEmployeeCodeAndPayPeriod(String employeeCode, LocalDate payPeriod);
    
    // Status-based queries
    List<Salary> findByStatus(PayrollStatus status);
    List<Salary> findByEmployeeCodeAndStatus(String employeeCode, PayrollStatus status);
    List<Salary> findByPayPeriodAndStatus(LocalDate payPeriod, PayrollStatus status);
}