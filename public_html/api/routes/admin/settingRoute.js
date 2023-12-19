const express = require('express');
const controller = require('../../controllers/admin/settingController');
const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
const validator = require('../../modules/admin/setting-validate');
const router= express.Router();

/* Main Setting Routes start*/
    router.post('/main/list',verifyToken,controller.mainSetting)
    router.post('/main/update',verifyToken,validator.mainUpdateValidate(),commonValidate,controller.mainSettingUpdate)
/* Main Setting Routes end*/
/* Order route Start */
    router.post('/order/list',verifyToken,controller.orderSettingList)
    router.post('/order/detail',verifyToken,controller.orderSettingDetail)
    router.post('/order/update',verifyToken,validator.orderUpdateValidate(),commonValidate,controller.orderSettingUpdate)
/*  Order setting route End */
module.exports = router