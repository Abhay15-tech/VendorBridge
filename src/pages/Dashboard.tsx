import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import OfficerDashboard from './dashboards/OfficerDashboard';
import VendorDashboard from './dashboards/VendorDashboard';

export default function Dashboard() {
  const { role } = useAuth();

  switch (role) {
    case 'Manager':
      return <ManagerDashboard />;
    case 'Officer':
      return <OfficerDashboard />;
    case 'Vendor':
      return <VendorDashboard />;
    case 'Admin':
    default:
      return <AdminDashboard />;
  }
}
