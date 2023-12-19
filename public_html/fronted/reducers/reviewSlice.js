import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from './mainSlice'

const reviewSlice =  createSlice({
    name: "ReviewRating",
    initialState:{
        reviewDetails:{}
    },
    reducers:{
        setUserReview:(state, action)=> {
             state.reviewDetails=action.payload.data
        }
    }
})

const { setUserReview } = reviewSlice.actions
export default reviewSlice.reducer

export const storeUserReview = (value) => async dispatch => {
    try {
        let res = await callApi('post','/rating/review',value)
        console.log("review response front side ", res.data);
        dispatch(setUserReview(res.data))
    } catch (error) {
        console.log("review error front side ", error);
        dispatch(apiFail(error))
    }
}