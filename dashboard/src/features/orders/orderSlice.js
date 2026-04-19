import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATA GENERATOR ---
const STATUSES = ['Completed', 'Processing', 'Shipped', 'Cancelled'];
const CUSTOMERS = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Evan Wright'];

const generateOrders = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (i * 15)); // Stagger orders by 15 mins
    
    return {
      id: `ORD-${5000 + i}`,
      customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
      total: (Math.random() * 500 + 50).toFixed(2),
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      items: Math.floor(Math.random() * 5) + 1
    };
  });
};

// --- REDUX LOGIC ---
export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  return new Promise(resolve => setTimeout(() => resolve(generateOrders(50)), 800));
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.list = action.payload;
      state.status = 'succeeded';
    });
  },
});

export default orderSlice.reducer;