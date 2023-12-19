import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const driverSlice = createSlice({
    name:"Driver",
    initialState:{
        driverList:null,
        driverDetail:{
            isLoading:true,
            data:{}
        },
        driverIncome:null,
        driverJob:null
    },
    reducers:{
        listing:(state,action)=>{
            state.driverList=action.payload
        },
        setDriverDetail:(state,action)=>{
            state.driverDetail = {
                isLoading:false,
                data: action.payload
            }
        },
        unSetDriverDetail:(state,action)=>{
            state.driverDetail = {
                isLoading:true,
                data: {}
            }
        },
        setDriverIncome:(state,action) => {
            state.driverIncome = action.payload
        },
        unSetDriverIncome:(state,action) => {
            state.driverIncome = null
        },
        setDriverJobs:(state,action) => {
            state.driverJob = action.payload
        },
        unSetDriverJobs:(state,action) => {
            state.driverJob = null
        }
    }
})
export default driverSlice.reducer
const { listing, setDriverDetail, unSetDriverDetail, setDriverIncome, unSetDriverIncome, setDriverJobs, unSetDriverJobs } = driverSlice.actions

export const getList = (page=1) => async dispatch =>{
    try {
        const res = await callApi('post',`/driver/list?page=${page}`,{})
        dispatch(unSetDriverDetail())
        dispatch(listing(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const getDetail = (value) => async dispatch =>{
    try {
        const res = await callApi('post',`/driver/detail`,value)
        dispatch(setDriverDetail(res.data.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const getDriverIncome = (value,filter) => async dispatch => {
    try {
        let tempVal = Object.assign({},value,filter)
        const res = await callApi('post',`/driver/driverIncome`,tempVal)
        dispatch(unSetDriverJobs())
        dispatch(setDriverIncome(res.data.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const getDriverJobs = (value,filter) => async dispatch => {
    try {
        let tempVal = Object.assign({},value,filter)
        const res = await callApi('post',`/driver/driverJobs`,tempVal)
        dispatch(unSetDriverIncome())
        dispatch(setDriverJobs(res.data.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}