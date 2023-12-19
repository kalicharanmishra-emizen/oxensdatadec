import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from './mainSlice'

const frontSlice = createSlice({
    name:"Store",
    initialState:{
        data:null
    },
    reducers:{
        setlatlng:(state,action)=>{
            state.data = action.payload.data
        }
    }
})

const { setlatlng } = frontSlice.actions
export default frontSlice.reducer
export const callContactUs = (value) => async dispatch => {
    try {
        let res = await callApi('post','/front/contactus',value)
        dispatch(apiSuccess(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const callCareers = (value) => async dispatch => {
    try {
        let res = await callApi('post','/front/career',value,{'Content-Type': 'multipart/form-data'})
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const callLatlong = (value) => async dispatch => {
    try {
        console.log("value", value);
        const res = await callApi("post", "/front/getlatlng", value)        
        console.log("get api lat lng ", res.data);
        dispatch(setlatlng(res.data))
    } catch (error) {
        console.log("api fail", error);
        dispatch(apiFail(error))
    }
}

