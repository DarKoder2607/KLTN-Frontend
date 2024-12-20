import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/sign-in`,data)
    return res.data
}

export const loginGoogleUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/sign-in-google`,data)
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/sign-up`,data)
    return res.data
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/user/get-details/${id}`,{
        headers: {
            token: `Bearer ${access_token}`,

        }
    })
    return res.data
}   

// export const refreshToken = async () => {
//     const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/refresh-token`, {
//         withCredentials: true
//     })
//     return res.data
// }

export const refreshToken = async (refreshToken) => {
    console.log('refreshToken', refreshToken)
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/refresh-token`, {} , {
        headers: {
            token: `Bearer ${refreshToken}`,
        }
    })
    return res.data
}  

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/log-out`)
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('refresh_token');
    return res.data
}  

export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteUser = async (id, access_token, data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/user/delete-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/user/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const forgotPassword = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/forgot-password`, data);
    return res.data;
}

export const resetPassword = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/user/reset-password`, data);
    return res.data;
}

export const chatbotChat = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/chat/chatbot/chat`,data)
    return res.data
}

export const lockUserAccount = async (id, token) => {
    const res = await axiosJWT.put(
      `${process.env.REACT_APP_API_KEY}/user/lock/${id}`,
      {},
      {
        headers: {
          token: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };
  
  export const unlockUserAccount = async (id, token) => {
    const res = await axiosJWT.put(
      `${process.env.REACT_APP_API_KEY}/user/unlock/${id}`,
      {},
      {
        headers: {
          token: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  export const getNotifications = async (userId, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/user/${userId}/notifications`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

export const markNotificationsAsRead = async (userId, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/user/${userId}/notifications/read`, {}, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};



  