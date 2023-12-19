import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/authSlice'
import mainSlice from './reducers/mainSlice'
import menuSlice from './reducers/menuSlice'
import orderSlice from './reducers/orderSlice'
import discountSlice from './reducers/discountSlice'
import reviewSlice from './reducers/reviewStore'
import storeSlice from "./reducers/storeSlice"
import settingSlice from "./reducers/settingSlice"

const reducer = {
  mainSlice,
  authSlice,
  menuSlice,
  orderSlice,
  discountSlice,
  reviewSlice,
  storeSlice,
  settingSlice
}

const store = configureStore({
  reducer
})

export default store