import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
let initialState = {
  counter: 0,
  products: [],
  brands: [],
};
export let getBrands = createAsyncThunk("product/getBrands", async function () {
  let { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/brands",
  );
  return data;
});
export let productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder.addCase(getBrands.fulfilled, (state, action) => {
      state.brands = action.payload.data;
    });
  },
});

export let { increament, decreament, incByValue ,brands} = productSlice.actions;
export let productReducer = productSlice.reducer;
