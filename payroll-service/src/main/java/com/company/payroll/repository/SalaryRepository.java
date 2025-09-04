package com.company.payroll.repository;

import com.company.payroll.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    List<Salary> findByEmployeeId(Long employeeId);
    List<Salary> findByEmployeeCode(String employeeCode);
    void deleteByEmployeeCode(String employeeCode);
}