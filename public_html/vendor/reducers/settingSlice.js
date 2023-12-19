import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const settingSlice = createSlice({
    name:"Setting",
    initialState:{
        main:{
            fixLimitDeliveryDistance:0,
            deliveryDistance:0,
            minDeliveryCharge:0,
            deliveryExtraFeeUnit:0,
            deliveryExtraFee:0,
        },
        storeDetail:{
            data:null
        },
    },
    reducers:{
        setMainSetting:(state,action)=>{
            state.main=action.payload
        },
        setStoreDetail:(state,action) => {
            state.storeDetail.data=action.payload.data
        },
    }
})
export default settingSlice.reducer
const {setMainSetting,setStoreDetail} = settingSlice.actions
export const getMainSetting = (value) => async dispatch =>{
    try {
        let res = await callApi('post','/setting/list',value)
        dispatch(setMainSetting(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const updateMainSetting = (value) => async dispatch => {
    try {
        let res = await callApi('post','/setting/update',value)
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const getStoreDetail = () => async dispatch => {
    try {
        let res = await callApi('post','/store/detail',{})
        dispatch(setStoreDetail(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}