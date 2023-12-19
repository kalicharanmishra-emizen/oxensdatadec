import { createSlice } from "@reduxjs/toolkit";
import Router from "next/router";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from './mainSlice'
const authSlice = createSlice({
    name: 'users',
    initialState: {
        loggedInUser : {
            isLoading:true,
            statusCode: "",
            message: "",
            data: {
                _id: "",
                name: "",
                email: "",
                phone_no: "",
                role: [],
                dob:""
            }
        },
        profile:null
    },
    reducers: {
        loginSuccess : (state,action)=>{
            localStorage.setItem('auth-user-token',action.payload.data.token)
            delete action.payload.data.token
            state.loggedInUser = action.payload
            state.loggedInUser['isLoading']=false
        },
        authUser:(state,action)=>{
            state.loggedInUser = action.payload
            state.loggedInUser['isLoading'] = false 
        },
        authProfile:(state,action)=>{
            state.profile = action.payload.data
        },
        logoutSuccess:(state,action)=>{
            state.loggedInUser={
                isLoading:true,
                statusCode: "",
                message: "",
                data: {
                    _id: "",
                    name: "",
                    email: "",
                    phone_no: "",
                    role: [],
                    dob:""
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
export const register = (value) => async dispatch => {
    try {
        const res = await callApi('post','/auth/signup',value)
        dispatch(loginSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}

export const logout= () => async dispatch =>{
    localStorage.removeItem('auth-user-token')
    localStorage.removeItem('selectAddress')
    dispatch(logoutSuccess());
    Router.push('/')
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
        // {'Content-Type': 'multipart/form-data'}
        const res = await callApi('post','/auth/updateprofile',values,)
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
export const forgetPassword = (value) => async dispatch => {
    try {
        let res = await callApi('post','/auth/forgetpassword',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const resetPass = (value) => async dispatch => {
    try {
        let res = await callApi('post','/auth/resetpassword',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}

  // {type : "posts/createPost", payload : {id : 123, title : "Hello World"}}