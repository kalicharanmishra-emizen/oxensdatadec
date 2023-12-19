import { createSlice } from "@reduxjs/toolkit";
import { logout } from 'reducers/authSlice'
const mainSlice = createSlice({
    name:'mainSlice',
    initialState:{
        success:null,
        failed:null,
    },
    reducers:{
        apiFailed:(state,action)=>{
            state.failed = action.payload 
        },
        unsetApiFailed:(state,action)=>{
            state.failed=null;
        },
        apiSucceed:(state,action)=>{
            state.success = action.payload 
        },
        unsetApiSucceed:(state,action)=>{
            state.success=null;
        },
    }
});
const {apiFailed,unsetApiFailed,apiSucceed,unsetApiSucceed} =mainSlice.actions
export default mainSlice.reducer
export const apiSuccess = (value) => async dispatch => {
    dispatch(apiSucceed(value))
}
export const apiFail = (value) => async dispatch => {
    if (value.statusCode == 419) {
        dispatch(logout())   
    }else{
        dispatch(apiFailed(value))
    }
}
export const unSetApiFail = () => async dispatch =>{
    dispatch(unsetApiFailed())
}
export const unSetApiSucc = () => async dispatch =>{
    dispatch(unsetApiSucceed())
}