import { configureStore } from '@reduxjs/toolkit'
import mainSlice from './reducers/mainSlice'
import authSlice from './reducers/authSlice'
import storeSlice from './reducers/storeSlice'
import frontSlice from './reducers/frontSlice'
import addressSlice from './reducers/addressSlice'
import orderSlice from './reducers/orderSlice'
import reviewSlice from "./reducers/reviewSlice"
const reducer = {
  authSlice,
  mainSlice,
  storeSlice,
  addressSlice,
  frontSlice,
  orderSlice,
  reviewSlice
}

const store = configureStore({reducer})

export default store