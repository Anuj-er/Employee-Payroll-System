package com.company.payroll.repository;

import com.company.payroll.entity.Salary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class SalaryJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Get all salaries for an employee using JDBC
    public List<Salary> findSalariesByEmployeeId(Long employeeId) {
        String sql = "SELECT * FROM salaries WHERE employee_id = ?";
        return jdbcTemplate.query(sql, new Object[]{employeeId},
            (rs, rowNum) -> {
                Salary s = new Salary();
                s.setId(rs.getLong("id"));
                s.setEmployeeId(rs.getLong("employee_id"));
                s.setEmployeeCode(rs.getString("employee_code"));
                s.setBasicSalary(rs.getDouble("basic_salary"));
                s.setAllowances(rs.getDouble("allowances"));
                s.setDeductions(rs.getDouble("deductions"));
                s.setNetSalary(rs.getDouble("net_salary"));
                s.setPayPeriod(rs.getDate("pay_period").toLocalDate());
                s.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                return s;
            });
    }
}