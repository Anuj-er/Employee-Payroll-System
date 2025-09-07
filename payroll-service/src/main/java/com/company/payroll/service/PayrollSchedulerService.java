package com.company.payroll.service;

import com.company.payroll.dto.EmployeeDTO;
import com.company.payroll.entity.Salary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PayrollSchedulerService {
    
    private static final Logger logger = LoggerFactory.getLogger(PayrollSchedulerService.class);
    
    @Autowired
    private PayrollService payrollService;

    @Autowired
    private JwtInterServiceClient jwtInterServiceClient;
    
    @Value("${payroll.automation.enabled:true}")
    private boolean automationEnabled;
    
    @Value("${payroll.bulk.transactional:true}")
    private boolean bulkTransactional;
    
    @Value("${employee.service.url}")
    private String employeeServiceUrl;

    // Run on 1st of every month at 9 AM
    @Scheduled(cron = "${payroll.automation.schedule:0 0 9 1 * ?}")
    public void generateMonthlyPayroll() {
        if (!automationEnabled) {
            logger.info("Payroll automation is disabled");
            return;
        }
        
        logger.info("Starting automated monthly payroll generation...");
        
        try {
            // Fetch all employees using JWT authentication
            org.springframework.http.ResponseEntity<EmployeeDTO[]> response = 
                jwtInterServiceClient.getWithJwt(employeeServiceUrl, EmployeeDTO[].class);
            
            EmployeeDTO[] employees = response.getBody();
            if (employees != null) {
                int processed = 0;
                for (EmployeeDTO employee : employees) {
                    try {
                        // Create salary record for current month
                        Salary salary = new Salary();
                        salary.setEmployeeId(employee.getId()); // Use actual employee ID
                        salary.setEmployeeCode(employee.getEmployeeCode());
                        salary.setPayPeriod(LocalDate.now().withDayOfMonth(1)); // First day of current month
                        
                        // Generate payroll (this will calculate allowances, deductions, etc.)
                        payrollService.generatePayroll(salary);
                        processed++;
                        
                    } catch (Exception e) {
                        if (e.getMessage() != null && e.getMessage().contains("already exists")) {
                            logger.info("Payroll already exists for employee: " + employee.getEmployeeCode() + ", skipping...");
                        } else {
                            logger.error("Failed to generate payroll for employee: " + employee.getEmployeeCode(), e);
                        }
                    }
                }
                logger.info("Automated payroll generation completed. Processed {} employees", processed);
            }
            
        } catch (Exception e) {
            logger.error("Error during automated payroll generation", e);
        }
    }

    // Manual bulk payroll generation endpoint support
    public String generateBulkPayroll() {
        logger.info("Starting manual bulk payroll generation...");
        try {
            if (bulkTransactional) {
                processAllEmployeesTransactionally();
                return "Bulk payroll generation completed successfully (transactional mode)";
            } else {
                generateMonthlyPayroll();
                return "Bulk payroll generation completed (non-transactional mode)";
            }
        } catch (Exception e) {
            logger.error("Bulk payroll generation failed", e);
            return "Bulk payroll generation failed: " + e.getMessage();
        }
    }
    
    // Transactional bulk processing - all or nothing
    @Transactional
    public void processAllEmployeesTransactionally() {
        logger.info("Starting transactional bulk payroll generation...");
        
        try {
            // Fetch all employees using JWT authentication
            org.springframework.http.ResponseEntity<EmployeeDTO[]> response = 
                jwtInterServiceClient.getWithJwt(employeeServiceUrl, EmployeeDTO[].class);
            
            EmployeeDTO[] employees = response.getBody();
            if (employees != null) {
                List<String> errors = new ArrayList<>();
                int processed = 0;
                
                for (EmployeeDTO employee : employees) {
                    try {
                        // Create salary record for current month
                        Salary salary = new Salary();
                        salary.setEmployeeId(employee.getId());
                        salary.setEmployeeCode(employee.getEmployeeCode());
                        salary.setPayPeriod(LocalDate.now().withDayOfMonth(1));
                        
                        // Generate payroll
                        payrollService.generatePayroll(salary);
                        processed++;
                        
                    } catch (Exception e) {
                        if (e.getMessage() != null && e.getMessage().contains("already exists")) {
                            logger.info("Payroll already exists for employee: " + employee.getEmployeeCode() + ", skipping...");
                        } else {
                            String errorMsg = "Failed to process employee " + employee.getEmployeeCode() + ": " + e.getMessage();
                            errors.add(errorMsg);
                            logger.error(errorMsg, e);
                        }
                    }
                }
                
                // If there were any critical errors, rollback everything
                if (!errors.isEmpty()) {
                    String combinedErrors = String.join("; ", errors);
                    throw new RuntimeException("Bulk payroll generation failed for some employees: " + combinedErrors);
                }
                
                logger.info("Transactional bulk payroll generation completed. Processed {} employees", processed);
            }
            
        } catch (Exception e) {
            logger.error("Error during transactional bulk payroll generation", e);
            throw e; // Rethrow to trigger rollback
        }
    }
}
