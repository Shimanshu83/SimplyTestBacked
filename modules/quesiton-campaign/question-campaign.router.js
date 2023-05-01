const express = require('express')
const router = express.Router()
const questionCampaignController = new (require('./question-campaign.controller'))();


router.get('/', questionCampaignController.getQuestionCampaign);

router.post('/add-basic-setting', questionCampaignController.addBasicSetting);

router.put('/update-basic-setting', questionCampaignController.editBasicSetting);

router.post('/add-question', questionCampaignController.addQuestion);

router.put('/update-question', questionCampaignController.editQuestion);

router.post('/add-time-access-setting', questionCampaignController.addTimeAccessSetting);



// router.get('/view-time-access-setting', questionCampaignController.viewTimeAccessSetting);


// router.put('/update-time-access-setting', questionCampaignController.editTimeAccessSetting);
// router.get('/question-campaing-list', questionCampaignController.listQuestion);
// router.get('/list-question', questionCampaignController.listQuestion);






module.exports = router;