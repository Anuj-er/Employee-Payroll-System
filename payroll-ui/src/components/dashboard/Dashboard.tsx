import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../layout';
import AdminDashboard from './AdminDashboard';
import HRDashboard from './HRDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        {user.role === 'ADMIN' ? <AdminDashboard /> : <HRDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
