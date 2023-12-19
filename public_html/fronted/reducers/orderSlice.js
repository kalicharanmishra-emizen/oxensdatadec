import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from './mainSlice'
const orderSlice = createSlice({
    name:"order",
    initialState:{
        charge:{},
        myOrderList:{
            isLoading:true,
            data:[],
            paginate:{
                next:false,
                curPage:1,
                nextPage:null
            }
        },
        orderDetail:{
            isLoading:true,
            data:{}
        },
        placeOrderData:{}

    },
    reducers:{
        setCharge:(state,action)=>{
            state.charge=action.payload.data
        },
        setMyOrderList:(state,action)=>{
            // state.myOrderList = {
            //     isLoading:false,
            //     data:action.payload.data
            // }
            state.myOrderList = {
                isLoading:false,
                data:action.payload.data,
                paginate:{
                    next:action.payload.data.hasNextPage,
                    curPage:action.payload.data.page,
                    nextPage:action.payload.data.nextPage
                }
            }
        },
        setOrderDetail:(state,action)=>{
            state.orderDetail = {
                isLoading:false,
                data:action.payload.data
            }
        },
        unSetOrderDetail:(state,action)=>{
            state.orderDetail = {
                isLoading:true,
                data:{},
                paginate:{
                    next:false,
                    curPage:1,
                    nextPage:null
                }
            }
        },
        getPlaceOeder:(state, action)=>{
            state.placeOrderData = action.payload.data
        }
    }
})
const { setCharge, setMyOrderList, setOrderDetail, unSetOrderDetail, getPlaceOeder } = orderSlice.actions
export default orderSlice.reducer
export const placeOrder = (value) => async dispatch => {
    try {
        let res = await callApi('post','/order/placeorder',value)
        dispatch(getPlaceOeder(res.data))
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const getAllOrderCharge = (value) => async dispatch => {
    try {
        let res = await callApi('post','/order/orderAllCharge',value)
        dispatch(setCharge(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
};
export const getMyOrderList = (page=1) => async dispatch => {
    try {
        let res = await callApi('post',`/order/myorder?page=${page}`,{})
        dispatch(setMyOrderList(res.data))
        dispatch(unSetOrderDetail())
    } catch (error) {
        dispatch(apiFail(error))
    }
};
export const getMyOrderDetail = (value) => async dispatch => {
    try {
        let res = await callApi('post','/order/detail',value)
        dispatch(setOrderDetail(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
};





