import React, { useState } from 'react';
import { Salary } from '../../types/employee';
import { payrollAPI } from '../../services/api';
import './PayrollList.css';

interface PayrollListProps {
  salaries: Salary[];
  onStatusUpdated: () => void;
}

const PayrollList: React.FC<PayrollListProps> = ({ salaries, onStatusUpdated }) => {
  const [loading, setLoading] = useState<number | null>(null);

  const handleStatusUpdate = async (id: number, status: Salary['status']) => {
    try {
      setLoading(id);
      await payrollAPI.updateSalaryStatus(id, status);
      onStatusUpdated();
    } catch (error) {
      alert('Failed to update salary status');
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: Salary['status']) => {
    const classes = {
      DRAFT: 'status-badge draft',
      APPROVED: 'status-badge approved',
      PAID: 'status-badge paid',
      CANCELLED: 'status-badge cancelled'
    };
    return <span className={classes[status]}>{status}</span>;
  };

  if (salaries.length === 0) {
    return (
      <div className="payroll-list">
        <div className="no-data">
          <h3>No payroll records found</h3>
          <p>Process your first salary to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payroll-list">
      <div className="list-header">
        <h2>Payroll Records ({salaries.length})</h2>
      </div>
      
      <div className="payroll-table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Pay Period</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary.id}>
                <td className="employee-code">{salary.employeeCode || 'N/A'}</td>
                <td className="currency">
                  ${salary.basicSalary ? salary.basicSalary.toLocaleString() : '0'}
                </td>
                <td className="currency positive">
                  ${salary.allowances ? salary.allowances.toLocaleString() : '0'}
                </td>
                <td className="currency negative">
                  ${salary.deductions ? salary.deductions.toLocaleString() : '0'}
                </td>
                <td className="currency net-salary">
                  ${salary.netSalary ? salary.netSalary.toLocaleString() : '0'}
                </td>
                <td>
                  {salary.payPeriod 
                    ? new Date(salary.payPeriod).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })
                    : 'N/A'
                  }
                </td>
                <td>{getStatusBadge(salary.status)}</td>
                <td>
                  <div className="action-buttons">
                    {salary.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(salary.id, 'APPROVED')}
                          disabled={loading === salary.id}
                          className="action-btn process"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(salary.id, 'CANCELLED')}
                          disabled={loading === salary.id}
                          className="action-btn cancel"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {salary.status === 'APPROVED' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(salary.id, 'PAID')}
                          disabled={loading === salary.id}
                          className="action-btn paid"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(salary.id, 'CANCELLED')}
                          disabled={loading === salary.id}
                          className="action-btn cancel"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {(salary.status === 'PAID' || salary.status === 'CANCELLED') && (
                      <span className="no-actions">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollList;
