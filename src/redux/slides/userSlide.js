import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    id: '',
    isAdmin: false,
    city: '',
    refreshToken: '',
    rewardPoints: 0,
    notifications: [],
    shippingAddress: {
        name: '',
        address: '',
        ward: '',
        district: '',
        city: '',
        phone: '',
    },
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', address = '', phone = '', avatar = '', _id = '', isAdmin,city= '',refreshToken = '', rewardPoints = 0,  notifications = [], 
                shippingAddress = {
                    // name: '',
                    // address: '',
                    // ward: '',
                    // district: '',
                    // city: '',
                    // phone: '',
                },
            } = action.payload
            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            state.address = address ? address : state.address;
            state.phone = phone ? phone : state.phone;
            state.avatar = avatar ? avatar : state.avatar;
            state.id = _id ? _id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
            state.city = city ? city : state.city;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
            state.rewardPoints = rewardPoints ? rewardPoints : state.rewardPoints;
            state.notifications = notifications ? notifications : state.notifications; 
            state.shippingAddress = shippingAddress ? shippingAddress : state.shippingAddress;
            // state.shippingAddress = {
            //     name: shippingAddress.name || state.shippingAddress.name,
            //     address: shippingAddress.address || state.shippingAddress.address,
            //     ward: shippingAddress.ward || state.shippingAddress.ward,
            //     district: shippingAddress.district || state.shippingAddress.district,
            //     city: shippingAddress.city || state.shippingAddress.city,
            //     phone: shippingAddress.phone || state.shippingAddress.phone,
            // };
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.address = '';
            state.phone = '';
            state.avatar = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.city = '';
            state.refreshToken = ''
            state.rewardPoints = 0;
            state.notifications = [];
            state.shippingAddress={};
            state.shippingAddress = {
                name: '',
                address: '',
                ward: '',
                district: '',
                city: '',
                phone: '',
            };
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer