import { configureStore } from '@reduxjs/toolkit';
import salesReducer from '../features/sales/salesSlice';
import productReducer from '../features/products/productSlice';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    sales: salesReducer,
    products: productReducer,
    orders: orderReducer,
  },
});