import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATA GENERATOR ---
const CATEGORIES = ['Electronics', 'Home & Garden', 'Fashion', 'Sports'];
const PRODUCT_NAMES = [
  'Wireless Noise-Canceling Headphones', '4K Ultra HD Smart TV', 'Mechanical Gaming Keyboard', 
  'Organic Cotton T-Shirt', 'Stainless Steel Water Bottle', 'Yoga Mat Premium', 
  'Smart Home Hub', 'Bluetooth Speaker Mini', 'Running Shoes Pro', 'Ceramic Coffee Mug'
];

const generateProducts = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `PROD-${1000 + i}`,
    name: PRODUCT_NAMES[i % PRODUCT_NAMES.length] + (i > 9 ? ` (Var ${i})` : ''),
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    price: (Math.random() * 200 + 20).toFixed(2),
    stock: Math.floor(Math.random() * 150),
    status: Math.random() > 0.8 ? 'Low Stock' : 'In Stock', // 20% chance of low stock
  }));
};

// --- REDUX LOGIC ---
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  return new Promise(resolve => setTimeout(() => resolve(generateProducts(25)), 600));
});

const productSlice = createSlice({
  name: 'products',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.list = action.payload;
      state.status = 'succeeded';
    });
  },
});

export default productSlice.reducer;