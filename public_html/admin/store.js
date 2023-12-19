import { configureStore } from '@reduxjs/toolkit'
import mainSlice from './reducers/mainSlice'
import categorySlice from './reducers/categorySlice'
import authSlice from './reducers/authSlice'
import vendorSlice from './reducers/vendorSlice'
import driverSlice from './reducers/driverSlice'
import userSlice from './reducers/userSlice'
import requestSlice from './reducers/requestSlice'
import cmsSlice from './reducers/cmsSlice'
import settingSlice from './reducers/settingSlice'
import orderSlice from './reducers/orderSlice'
import menuSlice from './reducers/menuSlice'


const reducer = {
  mainSlice,
  authSlice,
  vendorSlice,
  driverSlice,
  categorySlice,
  userSlice,
  requestSlice,
  cmsSlice,
  settingSlice,
  orderSlice,
  menuSlice
}

const store = configureStore({
  reducer
})

export default store