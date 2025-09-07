import React, { useState } from 'react';
import { Employee, Salary } from '../../types/employee';
import { payrollAPI } from '../../services/api';
import './PayrollForm.css';

interface PayrollFormProps {
  employees: Employee[];
  onSalaryProcessed: () => void;
}

const PayrollForm: React.FC<PayrollFormProps> = ({ employees, onSalaryProcessed }) => {
  const [formData, setFormData] = useState({
    employeeCode: '',
    basicSalary: '',      // Changed from baseSalary to basicSalary
    allowances: '0',
    deductions: '0',
    payPeriod: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeCode) {
      newErrors.employeeCode = 'Employee is required';
    }
    if (!formData.basicSalary || parseFloat(formData.basicSalary) <= 0) {
      newErrors.basicSalary = 'Valid basic salary is required';
    }
    if (parseFloat(formData.allowances) < 0) {
      newErrors.allowances = 'Allowances cannot be negative';
    }
    if (parseFloat(formData.deductions) < 0) {
      newErrors.deductions = 'Deductions cannot be negative';
    }
    if (!formData.payPeriod) {
      newErrors.payPeriod = 'Pay period is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const basicSalary = parseFloat(formData.basicSalary);
      const allowances = parseFloat(formData.allowances);
      const deductions = parseFloat(formData.deductions);
      
      // Convert YYYY-MM to YYYY-MM-01 for LocalDate compatibility (updated)
      const payPeriodDate = formData.payPeriod + '-01';
      
      const salaryData: Omit<Salary, 'id'> = {
        employeeId: selectedEmployee!.id,
        employeeCode: formData.employeeCode,
        basicSalary,
        allowances,
        deductions,
        netSalary: basicSalary + allowances - deductions,
        payPeriod: payPeriodDate,
        status: 'DRAFT'
      };
      
      await payrollAPI.processSalary(salaryData);
      onSalaryProcessed();
      
      // Reset form
      setFormData({
        employeeCode: '',
        basicSalary: '',
        allowances: '0',
        deductions: '0',
        payPeriod: '',
      });
      setSelectedEmployee(null);
      setErrors({});
    } catch (error: any) {
      console.error('Payroll submission error:', error);
      let errorMessage = 'Failed to process salary. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data. Please check all fields and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeCode = e.target.value;
    const employee = employees.find(emp => emp.employeeCode === employeeCode);
    
    setFormData(prev => ({ 
      ...prev, 
      employeeCode,
      basicSalary: employee && employee.basicSalary ? employee.basicSalary.toString() : prev.basicSalary
    }));
    setSelectedEmployee(employee || null);
    
    if (errors.employeeCode) {
      setErrors(prev => ({ ...prev, employeeCode: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const basicSalary = parseFloat(formData.basicSalary) || 0;
  const allowances = parseFloat(formData.allowances) || 0;
  const deductions = parseFloat(formData.deductions) || 0;
  const netSalary = basicSalary + allowances - deductions;

  return (
    <form onSubmit={handleSubmit} className="payroll-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="employeeCode">Employee *</label>
          <select
            id="employeeCode"
            name="employeeCode"
            value={formData.employeeCode}
            onChange={handleEmployeeChange}
            disabled={loading}
            className={errors.employeeCode ? 'error' : ''}
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.employeeCode}>
                {employee.employeeCode} - {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
          {errors.employeeCode && <span className="error-text">{errors.employeeCode}</span>}
        </div>

        {selectedEmployee && (
          <div className="employee-info">
            <h4>Employee Details</h4>
            <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
            <p><strong>Department:</strong> {selectedEmployee.department}</p>
            <p><strong>Position:</strong> {selectedEmployee.position}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="basicSalary">Basic Salary *</label>
          <input
            type="number"
            id="basicSalary"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            disabled={loading}
            className={errors.basicSalary ? 'error' : ''}
            placeholder="Enter basic salary"
            min="0"
            step="0.01"
          />
          {errors.basicSalary && <span className="error-text">{errors.basicSalary}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="allowances">Allowances</label>
          <input
            type="number"
            id="allowances"
            name="allowances"
            value={formData.allowances}
            onChange={handleChange}
            disabled={loading}
            className={errors.allowances ? 'error' : ''}
            placeholder="Enter allowances"
            min="0"
            step="0.01"
          />
          {errors.allowances && <span className="error-text">{errors.allowances}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="deductions">Deductions</label>
          <input
            type="number"
            id="deductions"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            disabled={loading}
            className={errors.deductions ? 'error' : ''}
            placeholder="Enter deductions"
            min="0"
            step="0.01"
          />
          {errors.deductions && <span className="error-text">{errors.deductions}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="payPeriod">Pay Period *</label>
          <input
            type="month"
            id="payPeriod"
            name="payPeriod"
            value={formData.payPeriod}
            onChange={handleChange}
            disabled={loading}
            className={errors.payPeriod ? 'error' : ''}
          />
          {errors.payPeriod && <span className="error-text">{errors.payPeriod}</span>}
        </div>
      </div>

      {(basicSalary > 0 || allowances > 0 || deductions > 0) && (
        <div className="salary-summary">
          <h4>Salary Calculation</h4>
          <div className="calculation-row">
            <span>Basic Salary:</span>
            <span className="amount">${basicSalary.toLocaleString()}</span>
          </div>
          <div className="calculation-row">
            <span>Allowances:</span>
            <span className="amount positive">+${allowances.toLocaleString()}</span>
          </div>
          <div className="calculation-row">
            <span>Deductions:</span>
            <span className="amount negative">-${deductions.toLocaleString()}</span>
          </div>
          <div className="calculation-row total">
            <span><strong>Net Salary:</strong></span>
            <span className="amount net"><strong>${netSalary.toLocaleString()}</strong></span>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Processing...' : 'Process Salary'}
        </button>
      </div>
    </form>
  );
};

export default PayrollForm;
