import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { PropertyForm } from './components/admin/PropertyForm';
import { Dashboard } from './components/admin/Dashboard';
import { MapPage } from './components/admin/MapPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<MapPage />} />
        <Route path="properties/new" element={<PropertyForm />} />
        <Route path="properties/edit/:id" element={<PropertyForm />} />
      </Route>
    </Routes>
  );
}

export default App;
