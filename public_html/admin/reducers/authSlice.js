import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const authSlice = createSlice({
    name: 'users',
    initialState: {
        loggedInUser : {
            statusCode: "",
            message: "",
            data: {
                _id: "",
                name: "",
                email: "",
                phone_no: "",
                pro_image: "",
                role: []
            }
        },
    },
    reducers: {
        loginSuccess : (state,action)=>{
            console.log('action',action)
            localStorage.setItem('auth-token',action.payload.data.token)
            delete action.payload.data.token
            state.loggedInUser = action.payload
        },
        authProfile:(state,action)=>{
            state.loggedInUser = action.payload
        },
        logoutSuccess:(state,action)=>{
            state.loggedInUser={
                    statusCode: "",
                    message: "",
                    data: {
                        _id: "",
                        name: "",
                        email: "",
                        phone_no: "",
                        pro_image: "",
                        role: []
                    }
                }
            localStorage.removeItem('auth-token')
        },
    },
  })
  
const { loginSuccess,logoutSuccess,authProfile} = authSlice.actions
export default authSlice.reducer
  
export const login = (values) => async dispatch => {
    try {
        const res = await callApi('post','/auth/login',values)
        dispatch(loginSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const logout= () => async dispatch =>{
    dispatch(logoutSuccess());
}
export const getProfile = () => async dispatch =>{
    try {
        const res = await callApi('post','/auth/profile',{});
        dispatch(authProfile(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const updateProfile=(values)=>async dispatch =>{
    try {
        const res = await callApi('post','/auth/update',values,{'Content-Type': 'multipart/form-data'})
        dispatch(authProfile(res.data))   
        dispatch(apiSuccess(res.data));
    } catch (e) {
        dispatch(apiFail(e))
    }
    
}
export const updatePassword=(values)=>async dispatch=>{
    try {
        const res = await callApi('post','/auth/updatePassword',values);
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const forgetPassword = (value) => async dispatch => {
    try {
        let res = await callApi('post','/auth/forgetpassword',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const resetPassword = (value) => async dispatch => {
    try {
        let res = await callApi('post','/auth/resetpassword',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
  // {type : "posts/createPost", payload : {id : 123, title : "Hello World"}}