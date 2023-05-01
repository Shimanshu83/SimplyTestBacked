const express = require('express')
const router = express.Router()


const questionCampaignRoute = require('./quesiton-campaign/question-campaign.router');
const testRoute = require('./test/test.router');

const userRouter = require('./user/user.route')

router.use('/auth', userRouter);

router.use('/question-campaign', questionCampaignRoute);
router.use('/test', testRoute);

module.exports = router;