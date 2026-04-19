import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: '#1e293b', color: '#fff', padding: '20px' }}>
        <h2>Admin Pro</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '40px' }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #334155' }}>Dashboard</li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #334155' }}>Products</li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #334155' }}>Orders</li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #334155' }}>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, background: '#f1f5f9', overflowY: 'auto' }}>
        <header style={{ background: '#fff', padding: '15px 30px', borderBottom: '1px solid #e2e8f0' }}>
          <strong>Welcome back, Admin</strong>
        </header>
        <div style={{ padding: '30px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;