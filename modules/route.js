const express = require('express')
const router = express.Router()


const userRouter = require('./user/user.route')

router.use('/auth', userRouter);

router.use('/question-campagin', questionCampaign)

module.exports = router;