import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">GLAT Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Logout
        </button>
      </nav>
      <div className="flex items-center justify-center h-[calc(100vh-52px)]">
        <p className="text-gray-400 text-lg">Dashboard — coming soon</p>
      </div>
    </div>
  );
}
