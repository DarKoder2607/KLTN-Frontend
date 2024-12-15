import axios from "axios"

import { axiosJWT } from "./UserService"

export const createEvent = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/event/create`, data)
    return res.data
}

export const updateEvent = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/event/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const deleteEvent = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/event/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}


export const getAllEvents = async (search, limit, page) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/event/getAll?filter=name&filter=${search}&limit=${limit}&page=${page}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/event/getAll?limit=${limit}&page=${page}`)
    }
    return res.data
}
export const getDetailsEvent = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/event/getDetails/${id}`);
    return res.data;
}

