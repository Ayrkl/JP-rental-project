import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { PropertyForm } from './components/admin/PropertyForm';
import { Dashboard } from './components/admin/Dashboard';
import { MapPage } from './components/admin/MapPage';
import { ContractsPage } from './components/admin/ContractsPage';
import { Users } from './pages/admin/Users';
import { DocumentManager } from './pages/admin/DocumentManager';
import { Accounting } from './pages/admin/Accounting';
import { Applications } from './pages/admin/Applications';
import { Documents } from './pages/tenant/Documents';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TenantLayout } from './components/tenant/TenantLayout';
import { TenantDashboard } from './pages/tenant/TenantDashboard';
import { PortalLayout } from './components/portal/PortalLayout';
import { PortalHome } from './pages/portal/PortalHome';
import { PortalMapPage } from './pages/portal/PortalMapPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<MapPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="users" element={<Users />} />
        <Route path="documents" element={<DocumentManager />} />
        <Route path="accounting" element={<Accounting />} />
        <Route path="applications" element={<Applications />} />
        <Route path="properties/new" element={<PropertyForm />} />
        <Route path="properties/edit/:id" element={<PropertyForm />} />
      </Route>

      {/* Tenant */}
      <Route path="/tenant" element={<TenantLayout />}>
        <Route index element={<TenantDashboard />} />
        <Route path="documents" element={<Documents />} />
      </Route>

      {/* Portal */}
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<PortalHome />} />
        <Route path="map" element={<PortalMapPage />} />
      </Route>
    </Routes>
  );
}

export default App;
