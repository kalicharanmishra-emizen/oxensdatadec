import { createSlice } from "@reduxjs/toolkit";
import { logout } from 'reducers/authSlice'
import { callApi } from "../Helper/helper";
const mainSlice = createSlice({
    name:'mainSlice',
    initialState:{
        charge:{},
        success:null,
        failed:null,
        cart:{
            orderItems:{},
            storeId:null,
            orderType:0,
            totalQuantity:0,
            totalAmount:0.00,
        },
        placeOrderData:{},
        POSuser:[]
    },
    reducers:{
        apiFailed:(state,action)=>{
            console.log('error value',action.payload);
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
                state.cart = action.payload
            }else{
                state.cart = {
                    orderItems:{},
                    storeId:null,
                    orderType:0,
                    totalQuantity:0,
                    totalAmount:0.00,
                }
            }
        },
        setCharge:(state,action)=>{
            state.charge=action.payload.data
        },
        getPlaceOeder:(state, action)=>{
            state.placeOrderData = action.payload.data
        },
        getPOSuser:(state, action)=>{
            state.POSuser = action.payload.data
        }
    }
});
const { apiFailed, unsetApiFailed, apiSucceed, unsetApiSucceed, setCart, setCharge, getPlaceOeder, getPOSuser } =mainSlice.actions
export default mainSlice.reducer

export const apiSuccess = (value) => async dispatch => {
    dispatch( apiSucceed(value) )
}
export const apiFail = (value) => async dispatch => {
    if (value.statusCode == 419) {
        dispatch( logout() )   
    }else{
        dispatch( apiFailed(value) )
    }
}
export const unSetApiFail = () => async dispatch =>{
    dispatch( unsetApiFailed() )
}
export const unSetApiSucc = () => async dispatch =>{
    dispatch( unsetApiSucceed() )
}
export const manageCartData = () => async dispatch =>{
    dispatch( setCart(JSON.parse(localStorage.getItem('cart'))) )
}
export const getAllOrderCharge = () => async dispatch => {
    try {
        let res = await callApi('post','/store/orderAllCharge',{})
        dispatch(setCharge(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
};
export const placeOrder = (value) => async dispatch => {
    try {
        let res = await callApi('post','/store/placeorder',value)
        dispatch(getPlaceOeder(res.data))
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
};
export const getPOSusers = (value) => async dispatch => {
    try {
        console.log("value", value);
        let res = await callApi('post','/store/posuser',value)
        console.log("resss ===============", res.data);
        dispatch(getPOSuser(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
};