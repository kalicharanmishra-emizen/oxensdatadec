import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from './mainSlice'
const storeSlice = createSlice({
    name:"Store",
    initialState:{
        filterList:{
            isLoading:true,
            type:[]
        },
        storeDetail:{
            isLoading:true,
            data:null
        },
        storeItems:{
            doc:[],
            paginate:{
                next:false,
                curPage:1,
                nextPage:null
            }
        },
        list:{
            isLoading:true,
            data:[]
        },
        detail:null
    },
    reducers:{
        setFilterList:(state,action)=>{
            state.filterList.isLoading = false
            state.filterList.type = action.payload.data
        },
        setStoreDetail:(state,action) => {
            state.storeDetail.isLoading=false,
            state.storeDetail.data=action.payload.data
        },
        unSetStoreDetail:(state,action) => {
            state.storeDetail.isLoading=true,
            state.storeDetail.data=null
        },
        setStoreItems:(state,action)=>{
            state.storeItems.doc=state.storeItems.doc.concat(action.payload.data.docs),
            state.storeItems.paginate.next=action.payload.data.hasNextPage
            state.storeItems.paginate.curPage=action.payload.data.page
            state.storeItems.paginate.nextPage=action.payload.data.nextPage
        },
        reinitializeStoreItems:(state,action)=>{
            state.storeItems.doc=action.payload.data.docs,
            state.storeItems.paginate.next=action.payload.data.hasNextPage
            state.storeItems.paginate.curPage=action.payload.data.page
            state.storeItems.paginate.nextPage=action.payload.data.nextPage
        },
        getOrderListing:(state,action) => {
            state.list = {
                isLoading: false,
                data: action.payload.data
            }
        },
        setDetail:(state,action) =>{
            state.detail = action.payload.data
        },
        unSetDetail:(state,action)=>{
            state.detail = null
        },
    }
})
const { setFilterList,  setStoreDetail, setStoreItems, reinitializeStoreItems, getOrderListing, setDetail, unSetDetail } = storeSlice.actions
export default storeSlice.reducer
export const getFilterList = () => async dispatch => {
    try {
        let res = await callApi('post','/store/filterlisting')
        dispatch(setFilterList(res.data))
    } catch (error) {
        apiFail(error)
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
export const getStoreItems = (value,page=1) => async dispatch => {
    try {
        let res = await callApi('post',`/store/productlist?page=${page}`,value)
        dispatch(setStoreItems(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const setFilterStoreItems = (value) => async dispatch => {
    try {
        let res = await callApi('post',`/store/productlist?page=1`,value)
        dispatch(reinitializeStoreItems(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const getCompletedorders = (page=1) => async dispatch => {
    try {
        const res = await callApi("post", `/store/posOrder?page=${page}`, {})
        dispatch(getOrderListing(res.data))
        dispatch(unSetDetail())
    } catch (error) {
        apiFail(error)
    }
}
export const posorderDetail = (value) => async dispatch => {
    try {
        const res = await callApi("post", "/store/posdetail", value)
        console.log("pos detail res", res.data);
        dispatch(setDetail(res.data))
    } catch (error) {
        apiFail(error)
    }
}



