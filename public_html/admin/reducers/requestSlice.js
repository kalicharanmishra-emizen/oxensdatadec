import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const requestSlice = createSlice({
    name:"request",
    initialState:{
        contact:[],
        career:[],
        becomeStore:[]
    },
    reducers:{
        contactList:(state,action) =>{
            state.contact=action.payload.data
        },
        careerList:(state,action) =>{
            state.career=action.payload.data
        },
        becomeStoreList:(state,action) =>{
            state.becomeStore=action.payload.data
        }
    }
})
export default requestSlice.reducer
const {contactList,careerList,becomeStoreList} = requestSlice.actions
export const getContactList = () => async dispatch => {
    try {
        let res = await callApi('post','/request/contact',{})
        dispatch(contactList(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const getCareerList = () => async dispatch => {
    try {
        let res = await callApi('post','/request/career',{})
        dispatch(careerList(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const getBecomeStoreList = () => async dispatch => {
    try {
        let res = await callApi('post','/request/becomestore',{})
        dispatch(becomeStoreList(res.data))
    } catch (error) {
        apiFail(error)
    }
}


