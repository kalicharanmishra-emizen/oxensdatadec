import { createSlice } from "@reduxjs/toolkit";
import {callApi} from '../Helper/helper'
import { apiFail,apiSuccess } from 'reducers/mainSlice'
const menuSlice = createSlice({
    name:"menuClice",
    initialState:{
        categoryList:[],
        categoryDetail:null,
        items:[],
        itemDetail:null,
        custome:[],
        costomDetails:null,
        customeVariant:[],
        costomDetailsVariant:null,
        variantDapendancyDetails:null
    },
    reducers:{
        menuCategory:(state,action) => {
            state.categoryList = action.payload.data
        },
        menuCategoryDetail:(state,action) => {
            state.categoryDetail = action.payload.data
        },
        unSetMenuCategoryDetail:(state,action) => {
            state.categoryDetail = null
        },
        itemLists:(state,action) => {
            state.items= action.payload.data
        },
        itemDetail:(state,action)=> {
            state.itemDetail = action.payload.data
        },
        unSetMenuItemDetail:(state,action)=>{
            state.itemDetail=null
        },
        customeList:(state,action) => {
            state.custome = action.payload.data
        },
        customeDetail:(state,action) => {
            state.costomDetails = action.payload.data
        },
        unSetCustomDetails:(state,action) =>{
            state.costomDetails = null
        },
        unSetCustome:(state,action) => {
            state.custome = []
        },
        customeVarientList:(state,action) => {
            state.customeVariant = action.payload.data
        },
        customeDetailVarient:(state,action) => {
            state.costomDetailsVariant = action.payload.data
        },
        unSetCustomDetailsVarient:(state,action) =>{
            state.costomDetailsVariant = null
        },
        dependancyDetail:(state,action) => {
            state.variantDapendancyDetails = action.payload.data
        },
        unSetDependancyDetail:(state,action) =>{
            state.variantDapendancyDetails = null
        },
        unSetCustomeVarient:(state,action) => {
            state.customeVariant = []
        }

    }
})
const { menuCategory, menuCategoryDetail, unSetMenuCategoryDetail, itemLists, itemDetail,unSetMenuItemDetail, customeList ,unSetCustome, customeDetail, unSetCustomDetails, customeVarientList ,unSetCustomeVarient, customeDetailVarient, unSetCustomDetailsVarient, dependancyDetail, unSetDependancyDetail} = menuSlice.actions
export default menuSlice.reducer
/* menu category reducres function start */
export const getCategoryList = () => async dispatch => {
    try {
        let res = await callApi('post','/menu/category/list',{})
        dispatch(menuCategory(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const getCategoryDetails = (value) => async dispatch => {
    try {
        console.log('get cat detail',value);
        let res = await callApi('post','/menu/category/detail',value)
        dispatch(menuCategoryDetail(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const unSetCategoryDetails = () => async dispatch => {
        dispatch(unSetMenuCategoryDetail())
}
export const createCategory = (value) => async dispatch => {
    try {
        let res = await callApi('post','/menu/category/create',value)
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const updateCategory = (value) => async dispatch => {
    try {
        let res = await callApi('post','/menu/category/update',value)
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
/* menu category reducres function end */
/* menu items reducres function start */
export const getItemsList = (value,page=1) => async dispatch => {
    try {
        let res = await callApi('post',`/menu/item/list?page=${page}`,value)
        dispatch(itemLists(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const createItems = (value) => async dispatch => {
    try {
        let res = await callApi('post','/menu/item/create',value,{'Content-Type': 'multipart/form-data'})
        console.log("create menu items spi res", res.data);
        dispatch(apiSuccess(res.data))
    } catch (error) {
        console.log("create menu items spi error", error);
        dispatch(apiFail(error))
    }
}
export const updateItems = (value) => async dispatch => {
    try {
        let res = await callApi('post','/menu/item/update',value,{'Content-Type': 'multipart/form-data'})
        dispatch(apiSuccess(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const getItemDetail = (value) => async dispatch => {
    try {
        let res = await callApi('post','/menu/item/detail',value)
        dispatch(itemDetail(res.data))
    } catch (error) {
        dispatch(apiFail(error))
    }
}
export const unSetItemDetails = () => async dispatch => {
    dispatch(unSetMenuItemDetail())
}
/* menu items reducres function end */
/* menu items customize reducres function start */
    export const getCustomeList = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/list',value)
            dispatch(customeList(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    export const unSetCustomeList = () => async dispatch => {
        dispatch(unSetCustome())
    }
    
    export const createCustome = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/create',value)
            dispatch(apiSuccess(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    export const detailCustomize = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/detail',value)
            dispatch(customeDetail(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    export const unSetDetailCustomize = () => async dispatch => {
        dispatch(unSetCustomDetails())
    }
    
    export const updateCustome = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/update',value)
            dispatch(apiSuccess(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
/* menu items customize reducres function end */
/* menu items customize Varients reducres function start */
    export const getCustomeVarientList = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/variant/list',value)
            dispatch(customeVarientList(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    export const unSetCustomeVarientList = () => async dispatch => {
        dispatch(unSetCustomeVarient())
    }
    
    export const createCustomeVarient = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/variant/create',value)
            dispatch(apiSuccess(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    export const detailCustomizeVarient = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/variant/detail',value)
            dispatch(customeDetailVarient(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    export const unSetDetailCustomizeVarient = () => async dispatch => {
        dispatch(unSetCustomDetailsVarient())
    }
    
    export const updateCustomeVarient = (value) => async dispatch => {
        try {
            let res = await callApi('post','/menu/customize/variant/update',value)
            dispatch(apiSuccess(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    export const VarientDependent = (value) => async dispatch => {
        try {
           let res = await callApi('post','/menu/customize/variant/deplist',value)
            dispatch(dependancyDetail(res.data))
        } catch (error) {
            dispatch(apiFail(error))
        }
    }
    
/* menu items customize Varients reducres function end */

