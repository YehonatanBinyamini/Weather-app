import { createSlice } from '@reduxjs/toolkit';

const unitsSlice = createSlice({
  name: 'units',
  initialState: 'C', 
  reducers: {
    setUnits: (state, action) => {
      return action.payload; // (Fahrenheit ot Celsius)
    },
  },
});

export const { setUnits } = unitsSlice.actions;
export const unitsReducer = unitsSlice.reducer;
