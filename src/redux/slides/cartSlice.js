import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addingToCart: (state, action) => {
      const existingItem = state.cartItems.find(item => item.product === action.payload.product);
      if (existingItem) {
        existingItem.amount += action.payload.amount; // Tăng số lượng nếu sản phẩm đã có trong giỏ
      } else {
        state.cartItems.push(action.payload); // Thêm sản phẩm mới
      }
    },
    removesFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.product !== action.payload.product);
    },
    updatesCartItem: (state, action) => {
      const itemIndex = state.cartItems.findIndex(item => item.product === action.payload.product);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].amount = action.payload.amount;
      }
    },
    clearsCart: (state) => {
      state.cartItems = [];
    },
    setCarts: (state, action) => {
      state.cartItems = action.payload;
    }
  }
});

export const { addingToCart, removesFromCart, updatesCartItem, clearsCart, setCarts } = cartSlice.actions;
export default cartSlice.reducer;
