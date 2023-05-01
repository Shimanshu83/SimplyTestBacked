const express = require('express')
const router = express.Router()
const testController = new (require('./test.controller'))();


router.get('/get-basic-test-info', testController.getBasicQuestionCampaignInfo);

router.post('/start-test', testController.testStart);

router.post('/submit-single-answer', testController.submitSingleAnswer)

router.post('/submit-test', testController.testSubmitted);

// router.get('/view-time-access-setting', testController.viewTimeAccessSetting);


// router.put('/update-time-access-setting', testController.editTimeAccessSetting);
// router.get('/question-campaing-list', testController.listQuestion);
// router.get('/list-question', testController.listQuestion);






module.exports = router;