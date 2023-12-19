import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const settingSlice = createSlice({
    name:"Setting",
    initialState:{
        main:{
            driverWaitTime:0,
            serviceFee:0,
            maxServiceFee:0,
            deliveryDistance:0,
            minDeliveryCharge:0,
            deliveryExtraFee:0,
            fixLimitDeliveryDistance:0,
            deliveryExtraFeeUnit:0,
            vatCharge:0,
            fixDriverDistance:0,
            minDriverPayFirst:0,
            extraDriverPaySecond:0,
            deliveryExtraPayUnit:0,
            deliveryExtraPay:0,
            taxPay:0
        },
        order:{
            isLoading:true,
            data:[]
        },
        orderDetail:{
            vehicleType:'',
            maxDistance:'',
            packageLimit:[]
        }
    },
    reducers:{
        setMainSetting:(state,action)=>{
            state.main=action.payload
        },
        setOrderList:(state,action)=>{
            state.order= {
                isLoading:false,
                data:action.payload
            }
        },
        setOrderDetail:(state,action)=>{
            state.orderDetail = action.payload
        },
        unSetOrderDetail:(state,action)=>{
            state.orderDetail={
                vehicleType:'',
                maxDistance:'',
                packageLimit:[]
            }
        }
    }
})
export default settingSlice.reducer
const {setMainSetting,setOrderList,setOrderDetail,unSetOrderDetail} = settingSlice.actions
export const getMainSetting = () => async dispatch =>{
    try {
        let res = await callApi('post','/setting/main/list',{})
        dispatch(setMainSetting(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const updateMainSetting = (value) => async dispatch => {
    try {
        let res = await callApi('post','/setting/main/update',value)
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const getOrderSettingList = () => async dispatch =>{
    try {
        let res = await callApi('post','/setting/order/list',{})
        dispatch(unSetOrderDetail())
        dispatch(setOrderList(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const getOrderSettingDetail = (value) => async dispatch =>{
    try {
        let res = await callApi('post','/setting/order/detail',value)
        dispatch(setOrderDetail(res.data.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const updateOrderSetting = (value) => async dispatch =>{
    try {
        let res = await callApi('post','/setting/order/update',value)
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}