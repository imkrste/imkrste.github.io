import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from './orderSlice';

const RecentOrders = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.orders);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchOrders());
  }, [status, dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#10b981'; // Green
      case 'Processing': return '#f59e0b'; // Amber
      case 'Shipped': return '#3b82f6'; // Blue
      case 'Cancelled': return '#ef4444'; // Red
      default: return '#64748b';
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '15px' }}>Recent Orders</h3>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
              <th style={{ padding: '10px' }}>Order ID</th>
              <th style={{ padding: '10px' }}>Customer</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {list.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{order.id}</td>
                <td style={{ padding: '12px 10px' }}>
                  <div>{order.customer}</div>
                  <small style={{ color: '#94a3b8' }}>{order.items} items</small>
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    background: `${getStatusColor(order.status)}20`, 
                    color: getStatusColor(order.status) 
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right' }}>${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;