const express = require('express');
const router= express.Router();
/* required all user related route start */
const authRouter = require('../routes/user/authRoute');
const storeRouter = require('../routes/user/storeRoute');
const frontRoute = require('../routes/user/frontRoute');
const addressRoute = require('../routes/user/addressRoute');
const orderRoute = require('../routes/user/orderRoute');
const ratingRoute = require('../routes/user/ratingRoute');
/* required all user related route end */
/*  middlewares for user route start*/
router.use('/auth',authRouter);
router.use('/store',storeRouter);
router.use('/front',frontRoute);
router.use('/address',addressRoute);
router.use("/order",orderRoute)
router.use("/rating",ratingRoute)
/*  middlewares for user route end*/
module.exports=router