import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VendorList from './pages/vendors/VendorList';
import CreateVendor from './pages/vendors/CreateVendor';
import Approvals from './pages/approvals/Approvals';
import RFQList from './pages/rfqs/RFQList';
import CreateRFQ from './pages/rfqs/CreateRFQ';
import RFQDetails from './pages/rfqs/RFQDetails';
import QuotationList from './pages/quotations/QuotationList';
import QuotationComparison from './pages/quotations/QuotationComparison';
import POList from './pages/purchaseOrders/POList';
import CreatePO from './pages/purchaseOrders/CreatePO';
import SubmitQuotation from './pages/quotations/SubmitQuotation';
import InvoiceList from './pages/invoices/InvoiceList';
import CreateInvoice from './pages/invoices/CreateInvoice';
import ActivityLog from './pages/activity/ActivityLog';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import BlankPage from './pages/BlankPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vendorbridge-theme">
        <WorkflowProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<BlankPage title="Reset Password" />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/vendors" element={<VendorList />} />
                  <Route path="/vendors/new" element={<CreateVendor />} />
                  <Route path="/rfqs" element={<RFQList />} />
                  <Route path="/rfqs/new" element={<CreateRFQ />} />
                  <Route path="/rfqs/:id" element={<RFQDetails />} />
                  <Route path="/quotations" element={<QuotationList />} />
                  <Route path="/quotations/compare" element={<QuotationComparison />} />
                  <Route path="/quotations/submit" element={<SubmitQuotation />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/purchase-orders" element={<POList />} />
                  <Route path="/purchase-orders/new" element={<CreatePO />} />
                  <Route path="/invoices" element={<InvoiceList />} />
                  <Route path="/invoices/new" element={<CreateInvoice />} />
                  <Route path="/activity" element={<ActivityLog />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Catch all redirect to root (which is protected) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </WorkflowProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
