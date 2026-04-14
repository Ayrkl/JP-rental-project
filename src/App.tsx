import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { PropertyForm } from './components/admin/PropertyForm';
import { DashboardPage } from './pages/admin/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="properties/new" element={<PropertyForm />} />
      </Route>
    </Routes>
  );
}

export default App;
