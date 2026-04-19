import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './productSlice';

const ProductInventory = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3>Inventory</h3>
        <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>+ Add Product</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
            <th style={{ padding: '10px' }}>Product Name</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Price</th>
            <th style={{ padding: '10px' }}>Stock Level</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((prod) => (
            <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 10px', fontWeight: '500' }}>{prod.name}</td>
              <td style={{ padding: '12px 10px', color: '#64748b' }}>{prod.category}</td>
              <td style={{ padding: '12px 10px' }}>${prod.price}</td>
              <td style={{ padding: '12px 10px' }}>
                <div style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min(prod.stock, 100)}%`, 
                    height: '100%', 
                    background: prod.stock < 20 ? '#ef4444' : '#10b981' 
                  }}></div>
                </div>
                <small style={{ color: '#94a3b8' }}>{prod.stock} units</small>
              </td>
              <td style={{ padding: '12px 10px' }}>
                 <span style={{ color: prod.status === 'Low Stock' ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '12px' }}>
                   ● {prod.status}
                 </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductInventory;