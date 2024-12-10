import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orderItems: [],
  orderItemsSlected: [],
  shippingAddress: {
  },
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: '',
  isSucessOrder: false,
}

export const orderSlide = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state.orderItems.find(item => item.product === orderItem.product);
      
      if (itemOrder) {
        if (itemOrder.amount <= itemOrder.countInstock) {
          itemOrder.amount += orderItem.amount;
          state.isSucessOrder = true;
          state.isErrorOrder = false;
        }
      } else {
        state.orderItems.push(orderItem);
      }
    
      // Recalculate the total number of items in the cart
      state.totalItems = state.orderItems.reduce((total, item) => total + item.amount, 0);
    },
    resetOrder: (state) => {
      state.isSucessOrder = false
    },
    increaseAmount: (state, action) => {
      const {idProduct} = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
      const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct)
      itemOrder.amount++;
      if(itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const {idProduct} = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
      const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct)
      itemOrder.amount--;
      if(itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const {idProduct} = action.payload
      
      const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
      const itemOrderSeleted = state?.orderItemsSlected?.filter((item) => item?.product !== idProduct)

      state.orderItems = itemOrder;
      state.orderItemsSlected = itemOrderSeleted;
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;

      state.orderItems = state.orderItems.filter((item) => !listChecked.includes(item.product));
      state.orderItemsSlected = state.orderItemsSlected.filter((item) => !listChecked.includes(item.product));
    },
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      state.orderItemsSlected = listChecked;  
    },
    removeAllOrderLogout: (state, action) => {
      state.orderItems = []
      state.orderItemsSlected = []
    },
  },
  
})

// Action creators are generated for each case reducer function
export const { addOrderProduct,increaseAmount,decreaseAmount,removeOrderProduct,removeAllOrderProduct, selectedOrder,resetOrder, removeAllOrderLogout } = orderSlide.actions

export default orderSlide.reducer