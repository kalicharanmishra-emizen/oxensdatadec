import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const userSlice = createSlice({
    name:"User",
    initialState:{
        userList:null,
    },
    reducers:{
        listing:(state,action)=>{
            state.userList=action.payload
        },
    }
})
export default userSlice.reducer
const { listing } = userSlice.actions

export const getList = (page=1) => async dispatch =>{
    try {
        const res = await callApi('post',`/user/list?page=${page}`,{})
        dispatch(listing(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
