import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
import Router from "next/router";

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
        profile:null
    },
    reducers: {
        loginSuccess : (state,action)=>{
            localStorage.setItem('auth-vendor-token',action.payload.data.token)
            delete action.payload.data.token
            state.loggedInUser = action.payload
        },
        authUser:(state,action)=>{
            state.loggedInUser = action.payload
        },
        authProfile:(state,action)=>{
            state.profile = action.payload.data
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
            
        },
    },
  })
  
const { loginSuccess,logoutSuccess,authProfile,authUser } = authSlice.actions
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
    localStorage.removeItem('auth-vendor-token')
    dispatch(logoutSuccess());
    Router.push('/login')

}
export const getAuthUser = () => async dispatch =>{
    try {
        const res = await callApi('post','/auth/getauthuser',{});
        dispatch(authUser(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const getProfile = () => async dispatch => {
    try {
        const res = await callApi('post','/auth/getprofile',{});
        dispatch(authProfile(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}

export const updateProfile=(values)=>async dispatch =>{
    try {
        const res = await callApi('post','/auth/updategeneral',values,{'Content-Type': 'multipart/form-data'})
        dispatch(apiSuccess(res.data));
    } catch (e) {
        dispatch(apiFail(e))
    }
    
}
export const updatePassword=(values)=>async dispatch=>{
    try {
        const res = await callApi('post','/auth/updatepassword',values);
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const updateTiming=(values)=>async dispatch=>{
    try {
        const res = await callApi('post','/auth/updatevendortiming',values);
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