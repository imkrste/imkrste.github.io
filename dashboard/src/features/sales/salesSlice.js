import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock datasets
const MOCK_DATA = {
  '30_days': [
    { date: '2023-06-01', value: 2800 },
    { date: '2023-06-05', value: 2950 },
    { date: '2023-06-10', value: 3100 },
    { date: '2023-06-15', value: 3400 },
    { date: '2023-06-20', value: 3200 },
    { date: '2023-06-25', value: 3800 },
    { date: '2023-06-30', value: 4100 },
  ],
  'ytd': [ // Year to Date (Monthly)
    { date: '2023-01-01', value: 1200 },
    { date: '2023-02-01', value: 2100 },
    { date: '2023-03-01', value: 800 },
    { date: '2023-04-01', value: 1600 },
    { date: '2023-05-01', value: 3200 },
    { date: '2023-06-01', value: 2800 },
  ]
};

export const fetchSalesData = createAsyncThunk(
  'sales/fetchData',
  async (range = 'ytd') => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DATA[range]);
      }, 500);
    });
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    data: [],
    status: 'idle',
    currentRange: 'ytd', // Track the active filter
  },
  reducers: {
    setRange: (state, action) => {
      state.currentRange = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      });
  },
});

export const { setRange } = salesSlice.actions;
export default salesSlice.reducer;