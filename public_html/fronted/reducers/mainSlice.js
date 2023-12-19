import { createSlice } from "@reduxjs/toolkit";
import Router from "next/router";
import { logout } from './authSlice'
const mainSlice = createSlice({
    name:'mainSlice',
    initialState:{
        success:null,
        failed:null,
        cart:{
            orderItems:{},
            storeId:null,
            userId:null,
            orderType:0,
            totalQuantity:0,
            totalAmount:0.00,
        }
    },
    reducers:{
        apiFailed:(state,action)=>{
            state.failed = action.payload 
        },
        unsetApiFailed:(state,action)=>{
            state.failed=null;
        },
        apiSucceed:(state,action)=>{
            state.success = action.payload 
        },
        unsetApiSucceed:(state,action)=>{
            state.success=null;
        },
        setCart:(state,action)=>{
            if(action.payload){
                state.cart = {
                    orderItems:action.payload.orderItems,
                    storeId:action.payload.storeId,
                    userId:action.payload.userId,
                    orderType:action.payload.orderType ? action.payload.orderType : 0,
                    totalQuantity:action.payload.totalQuantity,
                    totalAmount:action.payload.totalAmount,
                }
            }else{
                state.cart = {
                    orderItems:{},
                    storeId:null,
                    userId:null,
                    orderType:0,
                    totalQuantity:0,
                    totalAmount:0.00,
                }
            }
        }
    }
});
const {apiFailed,unsetApiFailed,apiSucceed,unsetApiSucceed,setCart} =mainSlice.actions
export default mainSlice.reducer
export const apiSuccess = (value) => async dispatch => {
    dispatch(apiSucceed(value))
}
export const apiFail = (value) => async dispatch => {
    if (value.statusCode == 419) {
        dispatch(logout()) 
    }else{
        dispatch(apiFailed(value))
    }
}
export const unSetApiFail = () => async dispatch =>{
    dispatch(unsetApiFailed())
}
export const unSetApiSucc = () => async dispatch =>{
    dispatch(unsetApiSucceed())
}
export const manageCartData = () => async dispatch =>{
    dispatch(setCart(JSON.parse(localStorage.getItem('cart'))))
}
