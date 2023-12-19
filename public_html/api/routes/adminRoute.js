const express = require('express');
const router= express.Router();
/* required all admin related route start */
const authRouter = require('../routes/admin/authRoute');
const vendorRouter = require('../routes/admin/vendorRoute');
const driverRoute = require('../routes/admin/driverRoute');
const userRouter = require('../routes/admin/userRoute');
const categoryRouter = require('../routes/admin/categoryRoute');
const requestRouter = require('../routes/admin/requestRoute');
const cmsRouter = require('../routes/admin/cmsRoute');
const settingRoute = require('../routes/admin/settingRoute');
const orderRoute = require('../routes/admin/orderRoute');
const menuRoute = require('../routes/admin/menuRouter');
/* required all admin related route end */
/*  middlewares for admin route start*/
router.use('/auth',authRouter);
router.use('/vendor',vendorRouter);
router.use('/driver',driverRoute);
router.use('/user',userRouter);
router.use('/category',categoryRouter);
router.use('/request',requestRouter);
router.use('/cms',cmsRouter);
router.use('/setting',settingRoute);
router.use('/order',orderRoute);
router.use('/menu',menuRoute);
/*  middlewares for admin route end*/
module.exports=router