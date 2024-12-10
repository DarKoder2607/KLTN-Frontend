import { axiosJWT } from "./UserService";


export const addToCart = async (productId, quantity, access_token) => {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_KEY}/cart/add`,
      { productId, quantity },
      {
        headers: { token: `Bearer ${access_token}` }, // Đảm bảo access_token đã được truyền đúng
      }
    );
    return res.data;
  };
  
// Remove from cart
export const removeFromCart = async (productId, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_KEY}/cart/remove/${productId}`,
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );
  return res.data;
};

// Get cart
export const getCart = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/cart`, {
    headers: { token: `Bearer ${access_token}` },
  });
  return res.data;
};

export const updateQuantity = async (productId, quantity, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_KEY}/cart/update-quantity`,
    { productId, quantity },
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );
  return res.data;
};

export const clearCart = async (access_token) => {
  try {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/cart/clear`, {
      headers: { token: `Bearer ${access_token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};