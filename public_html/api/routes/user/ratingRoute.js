const express = require('express')
const controller = require('../../controllers/user/ratingController')
const { varifyTokenUser } = require('../../middleware/auth')
const validator = require('../../modules/user/rating-validate')
const router = express.Router()
/* route start */
router.post('/review', varifyTokenUser, validator.ratingValidate(), commonValidate, controller.userRating)
router.post('/help', varifyTokenUser, validator.ratingValidate(), commonValidate, controller.help)
module.exports = router