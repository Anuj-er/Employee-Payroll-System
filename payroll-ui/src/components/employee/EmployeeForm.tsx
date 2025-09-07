import React, { useState } from 'react';
import { Employee } from '../../types/employee';
import { employeeAPI } from '../../services/api';
import './EmployeeForm.css';

interface EmployeeFormProps {
  onEmployeeAdded: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    joiningDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = [
    'IT', 'HR', 'Finance', 'Marketing', 'Operations', 
    'Sales', 'Engineering', 'Design', 'Legal', 'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = 'Employee code is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      newErrors.salary = 'Valid salary is required';
    }
    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
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
      const employeeData: Omit<Employee, 'id'> = {
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        basicSalary: parseFloat(formData.salary), // Map salary to basicSalary
        joinDate: formData.joiningDate // Map joiningDate to joinDate
      };
      
      await employeeAPI.createEmployee(employeeData);
      onEmployeeAdded();
      
      // Reset form
      setFormData({
        employeeCode: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        salary: '',
        joiningDate: ''
      });
      setErrors({});
    } catch (error) {
      alert('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="employeeCode">Employee Code *</label>
          <input
            type="text"
            id="employeeCode"
            name="employeeCode"
            value={formData.employeeCode}
            onChange={handleChange}
            disabled={loading}
            className={errors.employeeCode ? 'error' : ''}
            placeholder="e.g., EMP001"
          />
          {errors.employeeCode && <span className="error-text">{errors.employeeCode}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={loading}
            className={errors.firstName ? 'error' : ''}
            placeholder="Enter first name"
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
            className={errors.lastName ? 'error' : ''}
            placeholder="Enter last name"
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className={errors.email ? 'error' : ''}
            placeholder="Enter email address"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={loading}
            className={errors.department ? 'error' : ''}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <span className="error-text">{errors.department}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="position">Position *</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            disabled={loading}
            className={errors.position ? 'error' : ''}
            placeholder="Enter position/title"
          />
          {errors.position && <span className="error-text">{errors.position}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary *</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            disabled={loading}
            className={errors.salary ? 'error' : ''}
            placeholder="Enter annual salary"
            min="0"
            step="0.01"
          />
          {errors.salary && <span className="error-text">{errors.salary}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="joiningDate">Joining Date *</label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            disabled={loading}
            className={errors.joiningDate ? 'error' : ''}
          />
          {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
