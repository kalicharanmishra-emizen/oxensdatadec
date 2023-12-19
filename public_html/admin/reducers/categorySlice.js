import { createSlice } from "@reduxjs/toolkit";
import { callApi } from "../Helper/helper";
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const categorySlice = createSlice({
    name:'category',
    initialState: {
        typeList:[
            {
                value:"empty",
                label:"Select Type"
            }
        ],
        categoryList:[],
        categoryDetails:null
    },
    reducers:{
        typeLinting:(state,action)=>{
            action.payload.data.map(data=>{
                state.typeList.push(
                    {
                        value:data._id,
                        label:data.title
                    }
                )    
            })
        },
        setCategoryList:(state,action)=>{
            state.categoryList = action.payload.data
        },
        setCategoryDetail:(state,action)=>{
            state.categoryDetails = action.payload.data
        },
        unSetCategoryDetail:(state,action)=>{
            state.categoryDetails = null
        },
    }
})
const {typeLinting,setCategoryList,setCategoryDetail,unSetCategoryDetail} = categorySlice.actions
export default categorySlice.reducer

export const getApiType = () => async dispatch => {
    try {
        const res = await callApi('post','/category/type/list')
        dispatch(typeLinting(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const createCategory = (value) => async dispatch => {
    try {
        const res = await callApi('post','/category/create',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const getCategoryList = () => async dispatch => {
    try {
        const res = await callApi('post','/category/list',{})
        dispatch(setCategoryList(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const getCategoryDetails = (value) => async dispatch => {
    try {
        const res = await callApi('post','/category/detail',value)
        dispatch(setCategoryDetail(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}
export const removeCategoryDetails = () => async dispatch => {
        dispatch(unSetCategoryDetail())
}
export const updateCategory = (value) => async dispatch => {
    try {
        const res = await callApi('post','/category/update',value)
        dispatch(apiSuccess(res.data))
    } catch (e) {
        dispatch(apiFail(e))
    }
}





