import React, { useState, useEffect } from 'react';
import { Salary, Employee } from '../../types/employee';
import { payrollAPI, employeeAPI } from '../../services/api';
import { PayrollList, PayrollForm } from '../payroll';
import './HRDashboard.css';

const HRDashboard: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [salariesData, employeesData] = await Promise.all([
        payrollAPI.getAllSalaries(),
        employeeAPI.getAllEmployees()
      ]);
      setSalaries(salariesData);
      setEmployees(employeesData);
      setError('');
    } catch (err) {
      setError('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPayrollGeneration = async () => {
    try {
      setLoading(true);
      const result = await payrollAPI.generateBulkPayroll();
      alert(result);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError('Failed to generate bulk payroll');
    } finally {
      setLoading(false);
    }
  };

  const handleSalaryProcessed = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStatusUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const totalSalaries = salaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0);
  const draftSalaries = salaries.filter(s => s.status === 'DRAFT').length;
  const paidSalaries = salaries.filter(s => s.status === 'PAID').length;

  if (loading) {
    return (
      <div className="hr-dashboard">
        <div className="loading">Loading payroll data...</div>
      </div>
    );
  }

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <h1>Payroll Management</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{salaries.length}</h3>
            <p>Total Records</p>
          </div>
          <div className="stat-card draft">
            <h3>{draftSalaries}</h3>
            <p>Draft</p>
          </div>
          <div className="stat-card paid">
            <h3>{paidSalaries}</h3>
            <p>Paid</p>
          </div>
          <div className="stat-card total">
            <h3>${totalSalaries.toLocaleString()}</h3>
            <p>Total Amount</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-actions">
        <button
          onClick={() => setShowForm(!showForm)}
          className="primary-button"
        >
          {showForm ? 'Cancel' : 'Process New Salary'}
        </button>
        <button
          onClick={handleBulkPayrollGeneration}
          className="bulk-button"
          disabled={loading}
        >
          Generate Bulk Payroll
        </button>
        <button
          onClick={loadData}
          className="secondary-button"
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>Process New Salary</h2>
          <PayrollForm 
            employees={employees}
            onSalaryProcessed={handleSalaryProcessed}
          />
        </div>
      )}

      <div className="payroll-section">
        <PayrollList 
          salaries={salaries}
          onStatusUpdated={handleStatusUpdated}
        />
      </div>
    </div>
  );
};

export default HRDashboard;
