const responses = require('./test.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const testValidaitor = new (require('./test.validaitor'))();
const Validator = require('validatorjs');
const testService = new (require('./test.service'))();


module.exports = class testController {
    constructor() { }


    async getBasicQuestionCampaignInfo(req, res) {
        /**
         * 
         * Will get the questionCampaignId and from those information I need to provide basic information 
         * such as testName testCode description termsCondition id  duration validFrom validTill status 
         * if test status is inactive or setupInProgress then we will return test not found error. 
         * else we will return all the above data and and if the user open the test not between validFrom and 
         * valid till then we will handle this from frontend saying the test has overed test is not started yet
         */

        let returnResponse = {};

        let formData = {
            questionCampaignId: req.query.questionCampaignId
        }
        let validation = new Validator(formData, { questionCampaignId: "required|string" });
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await testService.getBasicQuestionCampaignInfo(formData.questionCampaignId);
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);


    }

    async testStart(req, res) {
        /**
         * we will accept firstName lastName email
         * check if question campaign exists 
         * status active | within validFrom and validTill and also consider duration for this use case 
         * check if answer is not submitted for this particular email 
         * so by design I think it better to create a all the aswers rows and 
         * then we can allow them to save those answers in one by one manner. 
         * so all the answers will be created for this
         * test should be persistant  <-- will figure it out later. 
         */
        let returnResponse = {};
        let formData = {
            questionCampaignId: req.body.questionCampaignId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }
        let validation = new Validator(formData, testValidaitor.startTest());
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await testService.testStart(formData);
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);


    }

    async submitSingleAnswer(req, res) {
        let returnResponse = {};
        let formData = {
            answerId: req.body.answerId,
            optionSelectedArray: req.body.optionSelectedArray
        }
        let validation = new Validator(formData, { answerId: 'required', 'optionSelectedArray.*': "required|string" });
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await testService.submitSingleAnswer(formData);
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);
    }

    async submitTest(req, res) {
        let returnResponse = {};
        let formData = {
            questionCampaignId: req.body.questionCampaignId,
            resultTableId: req.body.resultTableId,

        }
        let validation = new Validator(formData, { answerId: 'required', 'optionSelectedArray.*': "required|string" });
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await testService.submitTest(formData);
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);

    }

}