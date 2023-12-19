const express = require('express');
const router = express.Router()
/* required all driver related route start */
const authRouter = require('../routes/driver/authRoute');
const orderRoute = require('../routes/driver/orderRoute');
const homeRoute = require('../routes/driver/homeRoute');
/* required all driver related route end */
/*  middlewares for driver route start*/
router.use('/auth',authRouter);
router.use('/order',orderRoute);
router.use('/home',homeRoute);
/*  middlewares for driver route end*/
module.exports=router
