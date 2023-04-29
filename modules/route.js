const express = require('express')
const router = express.Router()


const questionCampaign = require('./quesiton-campaign/question-campaign.router');


const userRouter = require('./user/user.route')

router.use('/auth', userRouter);

router.use('/question-campaign', questionCampaign)

module.exports = router;