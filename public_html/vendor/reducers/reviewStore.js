import { createSlice } from "@reduxjs/toolkit";
import { callApi } from "../Helper/helper";
import { apiFail,apiSuccess } from 'reducers/mainSlice'

const reviewSlice = createSlice({
    name:"Review",
    initialState:{
        list:{
            isLoading:true,
            data:[]
        },
        helpList:{
            isLoading:true,
            data:{}
        }
    },
    reducers:{
        listing:(state,action)=>{
            state.list = {
                isLoading:false,
                data:action.payload.data
            }
        },
        helplisting:(state,action)=>{
            state.helpList = {
                isLoading:false,
                data:action.payload.data
            }
        }
    }
})

export default reviewSlice.reducer
const { listing, helplisting } = reviewSlice.actions

export const getStoreReviews = (page=1) => async dispatch => {
    try {
        const res = await callApi("post", `/store/list?page=${page}`, {}) 
        dispatch(listing(res.data))
    } catch (error) {
        console.log("store review error", error);
        dispatch(apiFail(error))
    }
}

export const getUserHelpReq = (page=1) => async dispatch => {
    try {
        const res = await callApi("post", `/store/help?page=${page}`, {}) 
        dispatch(helplisting(res.data))
    } catch (error) {
        console.log("store help review error", error);
        dispatch(apiFail(error))
    }
}