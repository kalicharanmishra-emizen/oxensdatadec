import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'

const cmsSlice = createSlice({
    name:"Cms",
    initialState:{
        list:{
            isLoading:true,
            data:[]
        },
        detail:{
            title:"",
            slug:"",
            content:""
        },
        dashboardList:{
            isLoading:true,
            data:[]
        },
    },
    reducers:{
        listing:(state,action)=>{
            state.list = {
                isLoading:false,
                data: action.payload.data
            }
        },
        setDetail:(state,action) =>{
            state.detail = action.payload.data
        },
        unSetDetail:(state,action)=>{
            state.detail = null
        },
        dashboard:(state,action)=>{
            state.dashboardList = {
                isLoading:false,
                data:action.payload.data
            }
        }
    }
})

export default cmsSlice.reducer
const { listing,setDetail,unSetDetail, dashboard } = cmsSlice.actions

export const getList = () => async dispatch =>{
    try {
        const res = await callApi('post','/cms/list',{})
        dispatch(listing(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const getDetail = (value) => async dispatch =>{
    try {
        const res = await callApi('post','/cms/detail',value)
        dispatch(setDetail(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    } 
}
export const resetDetail = () => async dispatch => {
    dispatch(unSetDetail())
};
export const updateCms = (value) => async dispatch => {
  try {
      let res = await callApi('post','/cms/update',value)
      dispatch(apiSuccess(res.data))
  } catch (error) {
      dispatch(apiFail(error))
  }
};
export const getDashboardData = () => async dispatch => {
   try {
      const res = await callApi("post", "/cms/dashboard", {})
      console.log("response api dashboard",res.data);
        dispatch(dashboard(res.data))
   } catch (error) {
       console.log("dashboard api error", error);
        dispatch(apiFail(error))
   }  
};

