import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const vendorSlice = createSlice({
    name:"vendor",
    initialState:{
        vendorList:null,
        vendorEdit:null,
    },
    reducers:{
        listing:(state,action)=>{
            state.vendorList=action.payload
        },
        edit:(state,action)=>{
            state.vendorEdit = action.payload.data
        },
        unSetEdit:(state,action)=>{
            state.vendorEdit = null
        },
    }
})
export default vendorSlice.reducer
const { listing,edit,unSetEdit } = vendorSlice.actions

export const getList = (page=1) => async dispatch =>{
    try {
        const res = await callApi('post',`/vendor/list?page=${page}`,{})
        dispatch(listing(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const getVendor = (userId) => async dispatch =>{
    try {
        const res = await callApi('post','/vendor/edit',{userId})
        dispatch(edit(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const createVendor = (value) => async dispatch =>{
    try {
        const res = await callApi('post','/vendor/create',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const updateVendor = (value) => async dispatch =>{
    try {
        const res = await callApi('post','/vendor/update',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const unSetEditVendor = () => async dispatch =>{
    dispatch(unSetEdit())
}