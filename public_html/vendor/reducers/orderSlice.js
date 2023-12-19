import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const orderSlice = createSlice({
    name:"Order",
    initialState:{
        list:{
            isLoading:true,
            data:[]
        },
        activeOrder:{
            idLoading:true,
            data:[]
        },
        detail:null
    },
    reducers:{
        listing:(state,action)=>{
            state.list = {
                isLoading:false,
                data: action.payload.data
            }
        },
        setDetail:(state,action) =>{
            state.detail = action.payload.data
        },
        unSetDetail:(state,action)=>{
            state.detail = null
        },
        activeListing:(state,action)=>{
            state.activeOrder={
                isLoading:false,
                data:action.payload.data
            }
        }
    }
})

export default orderSlice.reducer
const { listing,setDetail,unSetDetail,activeListing } = orderSlice.actions

export const getOrderList = (page) => async dispatch =>{
    try {
        const res = await callApi('post',`/order/list?page=${page}`,{})
        dispatch(listing(res.data))
        dispatch(unSetDetail())
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const getOrderDetail = (value) => async dispatch =>{
    try {
        const res = await callApi('post','/order/detail',value)
        dispatch(setDetail(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const getActiveOrder = () => async dispatch =>{
    try {
        let res = await callApi('post','/order/activeOrder',{})
        dispatch(activeListing(res.data))
    } catch (error) {
        dispatch(apiFail(error))   
    }
}