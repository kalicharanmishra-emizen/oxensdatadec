const express = require('express')
const controller = require('../../controllers/vendor/menuController')
const { commonValidate } = require('../../helper')
const { verifyTokenVendor } = require('../../middleware/auth')
const validator = require('../../modules/vendor/menu-validate');
const router = express.Router()
/* Menu category route start */
    router.post('/category/list',verifyTokenVendor,controller.categoryList)
    router.post('/category/create',verifyTokenVendor,controller.categoryCreate)
    router.post('/category/detail',verifyTokenVendor,controller.categoryDetail)
    router.post('/category/update',verifyTokenVendor,controller.categoryUpdate)
/* Menu category route end */
/* Menu Items route start */
    router.post('/item/list',verifyTokenVendor,controller.itemList)
    router.post('/item/create',verifyTokenVendor,validator.itemCreateValidate(),commonValidate,controller.itemCreate)
    router.post('/item/detail',verifyTokenVendor,controller.itemDetail)
    router.post('/item/update',verifyTokenVendor,validator.itemUpdateValidate(),commonValidate,controller.itemUpdate)
    router.post('/item/status',verifyTokenVendor,controller.itemStatus)
    router.post('/item/delete',verifyTokenVendor,controller.itemDelete)
/* Menu Items route end */
/* Menu Item Customize route start */
    router.post('/customize/list',verifyTokenVendor,controller.itemCustomizeList)
    router.post('/customize/create',verifyTokenVendor,validator.itemCustomizeCreateValidate(),commonValidate,controller.itemCustomizeCreate)
    router.post('/customize/detail',verifyTokenVendor,controller.itemCustomeDetail)
    router.post('/customize/update',verifyTokenVendor,validator.itemCustomizeUpdateValidate(),commonValidate,controller.itemCustomizeUpdate)
    router.post('/customize/delete',verifyTokenVendor,controller.itemCustomizeDelete)
    router.post('/customize/status',verifyTokenVendor,controller.itemCustomizeStatus)
/* Menu Item Customize route end */
/* Menu Customize Items route start */
    router.post('/customize/variant/deplist',verifyTokenVendor,controller.depedentVarientList)
    router.post('/customize/variant/list',verifyTokenVendor,controller.customizeVariantList)
    router.post('/customize/variant/detail',verifyTokenVendor,controller.customizeVariantDetail)
    router.post('/customize/variant/create',verifyTokenVendor,validator.customizeVariantCreateValidate(),commonValidate,controller.customizeVariantCreate)
    router.post('/customize/variant/update',verifyTokenVendor,validator.customizeVariantUpdateValidate(),commonValidate,controller.customizeVariantUpdate)
    router.post('/customize/variant/delete',verifyTokenVendor,controller.customizeVariantDelete)
/* Menu Customize Items route end */

module.exports = router