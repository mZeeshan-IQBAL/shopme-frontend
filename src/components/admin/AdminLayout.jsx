// src/components/admin/AdminLayout.jsx
export default function AdminLayout({ children }) {
  const handleLogout = () => {
    if (window.confirm("Log out of admin panel?")) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-primary text-white p-6 rounded-t-xl shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2 self-start sm:self-auto"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 bg-white rounded-b-xl shadow-md">
          {children}
        </main>

        {/* Footer Link */}
        <div className="p-6 pt-0">
          <a
            href="/"
            className="text-primary hover:underline text-sm font-medium transition-colors flex items-center gap-1"
          >
            ← <span>Back to Store</span>
          </a>
        </div>
      </div>
    </div>
  );
}