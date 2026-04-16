import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { PropertyForm } from './components/admin/PropertyForm';
import { Dashboard } from './components/admin/Dashboard';
import { MapPage } from './components/admin/MapPage';
import { ContractsPage } from './components/admin/ContractsPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
import { TenantLayout } from './components/tenant/TenantLayout';
import { TenantDashboard } from './pages/tenant/TenantDashboard';
import { PortalLayout } from './components/portal/PortalLayout';
import { PortalHome } from './pages/portal/PortalHome';
import { PortalMapPage } from './pages/portal/PortalMapPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/select" replace />} />
      <Route path="/select" element={<RoleSelectPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<MapPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="properties/new" element={<PropertyForm />} />
        <Route path="properties/edit/:id" element={<PropertyForm />} />
      </Route>

      {/* Tenant */}
      <Route path="/tenant" element={<TenantLayout />}>
        <Route index element={<TenantDashboard />} />
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
