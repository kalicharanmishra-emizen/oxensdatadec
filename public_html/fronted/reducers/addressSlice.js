import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from './mainSlice'

const addressSlice = createSlice({
    name:'Address',
    initialState:{
        list:{
            isLoading:true,
            data:[]
        }
    },
    reducers:{
        setList:(state,action)=>{
            state.list = {
                isLoading:false,
                data:action.payload
            }
        }
    }
})
const { setList } = addressSlice.actions
export default addressSlice.reducer
export const getAddress = () => async dispatch => {
    try {
        let res = await callApi('post','/address/list',{})
        dispatch(setList(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const createAddress = (value) => async dispatch => {
    try {
        let res = await callApi('post','/address/create',value)
        dispatch(setList(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const updateAddress = (value) => async dispatch => {
    try {
        let res = await callApi('post','/address/update',value)
        dispatch(setList(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const destoryAddress = (value) => async dispatch => {
    try {
        let res = await callApi('post','/address/destory',value)
        dispatch(setList(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
