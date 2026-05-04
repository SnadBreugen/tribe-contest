import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicPage } from './components/public/PublicPage';
import { AdminPage } from './components/admin/AdminPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { useLocalStorage } from './hooks/useLocalStorage';

export function App() {
  const [adminAuth] = useLocalStorage<boolean>('tribe-contest:adminAuth', false);

  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route
        path="/admin"
        element={adminAuth ? <AdminPage /> : <AdminLogin />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
