const express = require('express');
const controller = require('../../controllers/vendor/settingController');
const { commonValidate } = require('../../helper');
const {verifyTokenVendor} = require('../../middleware/auth');
const validator = require('../../modules/vendor/setting-validate');
const router= express.Router();

router.post('/list',verifyTokenVendor,controller.mainSetting)
router.post('/update',verifyTokenVendor,validator.mainUpdateValidate(),commonValidate,controller.mainSettingUpdate)

module.exports = router