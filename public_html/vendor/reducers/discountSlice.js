import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const discountSlice = createSlice({
    name:"Discount",
    initialState:{
        list:{
            discountType:0,
            discountValue:0,
            maxDiscount:0
        },
    },
    reducers:{
        listing:(state,action)=>{
            state.list = {
                discountType:action.payload.data.discountType||0,
                discountValue:action.payload.data.discountValue||0,
                maxDiscount:action.payload.data.maxDiscount||0
            }
        },
    }
})

export default discountSlice.reducer
const { listing } = discountSlice.actions

export const getDiscount = (page) => async dispatch =>{
    try {
        const res = await callApi('post',`/discount/detail`,{})
        dispatch(listing(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const updateDiscount = (value) => async dispatch =>{
    try {
        const res = await callApi('post','/discount/update',value)
        dispatch(apiSuccess(res.data))
        dispatch(listing(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}