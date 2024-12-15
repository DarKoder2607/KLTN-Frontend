import axios from "axios"

import { axiosJWT } from "./UserService"

export const getAllProduct = async (search, limit, page) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/getAll?filter=name&filter=${search}&limit=${limit}&page=${page}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/getAll?limit=${limit}&page=${page}`)
    }
    return res.data
}

export const getProductByDeviceType = async (deviceType, limit, page) => {
  if (deviceType) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_KEY}/product/getAllByDeviceType?deviceType=${deviceType}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const filterProducts = async (filters, page, limit) => {
  const query = new URLSearchParams({ ...filters, page, limit });
  const res = await axios.get(
    `${process.env.REACT_APP_API_KEY}/product/filter?${query.toString()}`
  );
  return res.data;
};

export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/getAll?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}

export const getProductDeviceType = async (deviceType, page, limit) => {
  if (deviceType) {
      const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/getAll?filter=deviceType&filter=${deviceType}&limit=${limit}&page=${page}`)
      return res.data
  }
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product/create`, data)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/details/${id}`)
    return res.data
}

export const getRecommedProduct = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/recommend/${id}`)
  return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllBrands = async (data) => {
  const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/brands`, data)
  return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyProduct = async (data, access_token,) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/product/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all-type`)
    return res.data
}
export const getAllDeviceTypeProduct = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all-device-type`)
  return res.data
}

export const getTopSelledProducts = async (limit = 6) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/top-selling?limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching top-selled products:', error.response?.data || error.message);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_KEY}/product/details/reviews/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  };
  
  export const addProductReview = async (productId, reviewData, access_token) => {
    try {
      const response = await axiosJWT.post(
        `${process.env.REACT_APP_API_KEY}/product/details/review/${productId}`,
        reviewData, 
        {
          headers: {
            token: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      // Check if the error is related to token expiration and handle accordingly
      if (error.response?.data?.message === 'Invalid or expired token') {
        // Refresh token logic or prompt for login
      }
      throw error;
    }
  };

  export const hideProductReview = async (productId, reviewId, accessToken) => {
    try {
      const response = await axiosJWT.put(
        `${process.env.REACT_APP_API_KEY}/product/details/review/hide/${productId}/${reviewId}`,
        {},
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error hiding review:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const unhideProductReview = async (productId, reviewId, accessToken) => {
    try {
      const response = await axiosJWT.put(
        `${process.env.REACT_APP_API_KEY}/product/details/review/unhide/${productId}/${reviewId}`,
        {},
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };