import React, { useState, useEffect } from 'react';
import { Employee } from '../../types/employee';
import { employeeAPI } from '../../services/api';
import { EmployeeList, EmployeeForm } from '../employee';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadEmployees();
  }, [refreshTrigger]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeAPI.getAllEmployees();
      setEmployees(data);
      setError('');
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeAdded = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEmployeeDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Employee Management</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{employees.length}</h3>
            <p>Total Employees</p>
          </div>
          <div className="stat-card">
            <h3>{new Set(employees.map(emp => emp.department)).size}</h3>
            <p>Departments</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-actions">
        <button
          onClick={() => setShowForm(!showForm)}
          className="primary-button"
        >
          {showForm ? 'Cancel' : 'Add New Employee'}
        </button>
        <button
          onClick={loadEmployees}
          className="secondary-button"
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>Add New Employee</h2>
          <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
        </div>
      )}

      <div className="employee-section">
        <EmployeeList 
          employees={employees} 
          onEmployeeDeleted={handleEmployeeDeleted}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
