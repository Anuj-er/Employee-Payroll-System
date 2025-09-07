package com.company.payroll.enums;

public enum PayrollStatus {
    DRAFT("Draft"),
    APPROVED("Approved"),
    PAID("Paid"),
    CANCELLED("Cancelled");
    
    private final String displayName;
    
    PayrollStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
