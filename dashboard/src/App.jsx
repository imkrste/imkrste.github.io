import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import DashboardLayout from './layouts/DashboardLayout';
import SalesChart from './features/sales/SalesChart';
import RecentOrders from './features/orders/RecentOrders';
import ProductInventory from './features/products/ProductInventory';

function App() {
  return (
    <Provider store={store}>
      <DashboardLayout>
        {/* Top Row: Sales Chart (2/3 width) and Recent Orders (1/3 width) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '20px', 
          marginBottom: '20px' 
        }}>
          {/* Chart Section */}
          <div style={{ minHeight: '400px' }}> 
            <SalesChart />
          </div>

          {/* Orders Section */}
          <div style={{ minHeight: '400px' }}>
            <RecentOrders />
          </div>
        </div>

        {/* Bottom Row: Full width Inventory */}
        <div style={{ marginBottom: '40px' }}>
          <ProductInventory />
        </div>

      </DashboardLayout>
    </Provider>
  );
}

export default App;