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
        storeList:{
            doc:[],
            paginate:{
                next:false,
                curPage:1,
                nextPage:null
            }
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
        storeRating:{
            doc:[],
            paginate:{
                next:false,
                curPage:1,
                nextPage:null
            }
        }
    },
    reducers:{
        setFilterList:(state,action)=>{
            state.filterList.isLoading = false
            state.filterList.type = action.payload.data
        },
        setStoreList:(state,action)=>{
            state.storeList.doc=state.storeList.doc.concat(action.payload.data.docs),
            state.storeList.paginate.next=action.payload.data.hasNextPage
            state.storeList.paginate.curPage=action.payload.data.page
            state.storeList.paginate.nextPage=action.payload.data.nextPage
        },
        reinitializeStoreList:(state,action)=>{
            state.storeList.doc=action.payload.data.docs,
            state.storeList.paginate.next=action.payload.data.hasNextPage
            state.storeList.paginate.curPage=action.payload.data.page
            state.storeList.paginate.nextPage=action.payload.data.nextPage
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
        getStoreRating:(state,action) => {
            if (action.payload.append) {
                state.storeRating.doc = state.storeRating.doc.concat(action.payload.data.docs)
            }else {
                state.storeRating.doc = action.payload.data.docs
            }
            state.storeRating.paginate.next=action.payload.data.hasNextPage
            state.storeRating.paginate.curPage=action.payload.data.page
            state.storeRating.paginate.nextPage=action.payload.data.nextPage
        }
    }
})
const { setFilterList, setStoreList, reinitializeStoreList, setStoreDetail, unSetStoreDetail,setStoreItems, reinitializeStoreItems, getStoreRating } = storeSlice.actions
export default storeSlice.reducer
export const getFilterList = () => async dispatch => {
    try {
        let res = await callApi('post','/store/filterlisting')
        dispatch(setFilterList(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const getStoreList = (value,page=1) => async dispatch => {
    try {
        let res = await callApi('post',`/store/listing?page=${page}`,value)
        dispatch(setStoreList(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const setFilterStoreList = (value,page=1) => async dispatch => {
    try {
        let res = await callApi('post',`/store/listing?page=${page}`,value)
        dispatch(reinitializeStoreList(res.data))
    } catch (error) {
        apiFail(error)
    }
}
export const getStoreDetail = (value) => async dispatch => {
    try {
        let res = await callApi('post','/store/detail',value)
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
export const storeRatingList = (value, page=1, append = false) => async dispatch => {
    try {
        let res = await callApi("post", `/store/storerating?page=${page}`, value)
        console.log("api response store rating list", res.data);
        dispatch(getStoreRating({
            data:res.data.data,
            append
        }))
    } catch (error) {
        console.log("api error store rating list", error);
        apiFail(error)
    }
}



