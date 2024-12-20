import { axiosJWT } from "./UserService"
import axios from 'axios';

// export const createProduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product/create`, data)
//   return res.data
// // }

export const createOrder = async (data,access_token) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/order/create/${data.user}`, data, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getOrderByUserId = async (id,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/get-all-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getDetailsOrder = async (id,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/get-details-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const cancelOrder = async (id, access_token, orderItems, userId ) => {
  const data = {orderItems, orderId: id}
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/order/cancel-order/${userId}`, {data}, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/get-all-order`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const markAsDelivered = async (id, access_token) => {
  const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/order/mark-as-delivered/${id}`, {}, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  })
  return res.data
}

export const markAsDelivered2 = async (id, access_token) => {
  const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/order/mark-as-delivered2/${id}`, {}, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  })
  return res.data
}

export const markAsPaid = async (id, access_token) => {
  const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/order/mark-as-paid/${id}`, {}, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  })
  return res.data
}

export const getTotalOrderPriceByProduct = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/total-order-price-by-product`, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  })
  return res.data
}

export const getRevenueByUser = async (accessToken, timeFrame) => {
  const response = await axios.get(`${process.env.REACT_APP_API_KEY}/order/revenue-by-user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      [timeFrame]: true, 
    },
  });
  return response;
};