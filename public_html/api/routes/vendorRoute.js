const express = require('express');
const router= express.Router();
/* required all Vendor related route start */
const authRouter = require('../routes/vendor/authRoute');
const menuRouter = require('../routes/vendor/menuRouter');
const orderRoute = require('../routes/vendor/orderRoute');
const discountRoute = require('../routes/vendor/discountRoute');
const reviewRoute = require('../routes/vendor/reviewRoute');
const settingRoute = require('../routes/vendor/settingRoute');
/* required all Vendor related route end */
/*  middlewares for Vendor route start*/
router.use('/auth',authRouter);
router.use('/menu',menuRouter);
router.use('/order',orderRoute);
router.use('/discount',discountRoute)
router.use('/store',reviewRoute)
router.use('/setting',settingRoute);
/*  middlewares for Vendor route end*/
module.exports=router