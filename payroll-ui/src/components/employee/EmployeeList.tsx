import React, { useState } from 'react';
import { Employee } from '../../types/employee';
import { employeeAPI } from '../../services/api';
import './EmployeeList.css';

interface EmployeeListProps {
  employees: Employee[];
  onEmployeeDeleted: () => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEmployeeDeleted }) => {
  const [loading, setLoading] = useState<number | null>(null);

  const handleDelete = async (employeeCode: string, id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee and all their salary records?')) {
      return;
    }

    try {
      setLoading(id);
      await employeeAPI.cascadeDeleteEmployee(employeeCode);
      onEmployeeDeleted();
      alert('Employee and related records deleted successfully');
    } catch (error) {
      alert('Failed to delete employee');
    } finally {
      setLoading(null);
    }
  };

  if (employees.length === 0) {
    return (
      <div className="employee-list">
        <div className="no-data">
          <h3>No employees found</h3>
          <p>Add your first employee to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <div className="list-header">
        <h2>Employee List ({employees.length})</h2>
      </div>
      
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="employee-code">{employee.employeeCode || 'N/A'}</td>
                <td className="employee-name">
                  {(employee.firstName || '')} {(employee.lastName || '')}
                </td>
                <td>{employee.email || 'N/A'}</td>
                <td>
                  <span className="department-badge">{employee.department || 'N/A'}</span>
                </td>
                <td>{employee.position || 'N/A'}</td>
                <td className="salary">
                  ${employee.basicSalary ? employee.basicSalary.toLocaleString() : '0'}
                </td>
                <td>
                  {employee.joinDate 
                    ? new Date(employee.joinDate).toLocaleDateString()
                    : 'N/A'
                  }
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(employee.employeeCode, employee.id)}
                    disabled={loading === employee.id}
                    className="delete-button"
                  >
                    {loading === employee.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
