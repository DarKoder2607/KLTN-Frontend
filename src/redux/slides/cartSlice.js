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
        existingItem.amount += action.payload.amount;  
      } else {
        state.cartItems.push(action.payload);  
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
    },
    increaseAmount: (state, action) => {
      const { idProduct, maxStock } = action.payload; 
      const cartItems = state?.cartItems?.find((item) => item?.product === idProduct);
      const cartItemsSelected = state?.cartItemsSlected?.find((item) => item?.product === idProduct);
      
      if (cartItems && cartItems.amount < maxStock) {
        cartItems.amount++;
      }
      if (cartItemsSelected && cartItemsSelected.amount < maxStock) {
        cartItemsSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const cartItems = state?.cartItems?.find((item) => item?.product === idProduct);
      const cartItemsSelected = state?.cartItemsSlected?.find((item) => item?.product === idProduct);
      if (cartItems && cartItems.amount > 1) {
        cartItems.amount--;
      }
      if (cartItemsSelected && cartItemsSelected.amount > 1) {
        cartItemsSelected.amount--;
      }
    }
  }
});

export const { addingToCart, removesFromCart, updatesCartItem, clearsCart, setCarts, increaseAmount, decreaseAmount } = cartSlice.actions;
export default cartSlice.reducer;
