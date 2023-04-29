const responses = require('./question-campaign.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const questionCampaignValidaitor = new (require('./question-campaign.validaitor'))();
const Validator = require('validatorjs');
const questionCampaignService = new (require('./question-campaign.service'))();
module.exports = class QuestionCampaign {
    constructor() { }

    async addBasicSetting(req, res, next) {
        let returnResponse = {};
        let formData = {
            testName: req.body.testName,
            testCode: req.body.testCode,
            description: req.body.description,
            termsCondition: req.body.termsCondition
        }
        let validation = new Validator(formData, questionCampaignValidaitor.basicSettingValidaitor());
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await questionCampaignService.basicSetting(formData)
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);
    }


    async editBasicSetting(req, res, next) { }
    async viewBasicSetting(req, res, next) { }


    async addQuestion(req, res, next) { }
    async editQuestion(req, res, next) { }
    async listQuestion(req, res, next) { }


    async addTimeAccessSetting(req, res, next) { }
    async editTimeAccessSetting(req, res, next) { }
    async viewTimeAccessSetting(req, res, next) { }

    async getQuestionCampaign(req, res, next) { }
    async listQuestionCampaign(req, res, next) { }


}