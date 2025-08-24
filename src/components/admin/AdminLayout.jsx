// Simple layout wrapper
export default function AdminLayout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 text-white p-6 rounded-t-xl relative">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        {children}
        <div className="p-6 pt-0">
          <a href="/" className="text-primary hover:underline text-sm font-medium">← Back to Store</a>
        </div>
      </div>
    </div>
  );
}