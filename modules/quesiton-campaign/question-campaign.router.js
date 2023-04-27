const express = require('express')
const router = express.Router()
const questionCampaignController = new (require('./question-campaign.controller'))();

router.post('/add-basic-setting', questionCampaignController.addBasicSetting);
router.put('/edit-basic-setting', questionCampaignController.editBasicSetting);
router.get('/view-basic-setting', questionCampaignController.viewBasicSetting);

router.post('/add-question', questionCampaignController.addQuestion);
router.put('/edit-question', questionCampaignController.editQuestion);
router.get('/list-question', questionCampaignController.listQuestion);


router.post('/add-time-access-setting', questionCampaignController.addTimeAccessSetting);
router.put('/edit-time-access-setting', questionCampaignController.editTimeAccessSetting);
router.get('/view-time-access-setting', questionCampaignController.viewTimeAccessSetting);


router.get('/question-campaing', questionCampaignController.getQuestionCampaign);
router.get('/question-campaing-list', questionCampaignController.listQuestion);






module.exports = router;