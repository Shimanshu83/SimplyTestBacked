const responses = require('./question-campaign.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const questionCampaignValidaitor = new (require('./question-campaign.validaitor'))();
const Validator = require('validatorjs');
const questionCampaignService = new (require('./question-campaign.service'))();
module.exports = class QuestionCampaign {
    constructor() { }

    async addBasicSetting(req, res) {
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


    async editBasicSetting(req, res, next) {
        let returnResponse = {};
        let formData = {
            testName: req.body.testName,
            testCode: req.body.testCode,
            description: req.body.description,
            termsCondition: req.body.termsCondition,
            id: req.body.id,
        }
        let validation = new Validator(formData, questionCampaignValidaitor.basicSettingValidaitor());
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await questionCampaignService.editBasicSetting(formData);
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);

    }


    async addQuestion(req, res) {
        // we need to add single single question one by one and return the question details with data . 
        let returnResponse = {};
        let formData = {
            questionCampaignId: req.body.questionCampaignId,
            questionText: req.body.questionText,
            questionType: req.body.questionType,
            correctAnswerPoint: req.body.correctAnswerPoint,
            incorrectAnswerPoint: req.body.incorrectAnswerPoint,
            options: req.body.options
        }
        let validation = new Validator(formData, questionCampaignValidaitor.addQuestion());
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await questionCampaignService.addQuestion(formData);
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);


    }
    async editQuestion(req, res, next) {

        let returnResponse = {};
        let formData = {
            id: req.body._id,
            questionCampaignId: req.body.questionCampaignId,
            questionText: req.body.questionText,
            questionType: req.body.questionType,
            correctAnswerPoint: req.body.correctAnswerPoint,
            incorrectAnswerPoint: req.body.incorrectAnswerPoint,
            options: req.body.options
        }
        let validation = new Validator(formData, questionCampaignValidaitor.addQuestion());
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await questionCampaignService.editQuestion(formData);
            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);

    }


    // async listQuestion(req, res, next) { }


    async addTimeAccessSetting(req, res) {
        let returnResponse = {};
        // so I have id right so no need of sending data from here what I will do is provide them the url using question campaign id and wait for the answers ; 
        let formData = {
            validFrom: req.body.validFrom,
            validTill: req.body.validTill,
            duration: req.body.duration,
            status: req.body.status,
            questionCampaignId: req.body.questionCampaignId
        }

        let validation = new Validator(formData, questionCampaignValidaitor.addTimeAccessSetting());
        if (validation.passes() && !validation.fails()) {
            try {
                // comparing if validFrom is smaller then validTill 
                let validFrom = new Date(formData.validFrom);
                let validTill = new Date(formData.validTill);
                if (validFrom < validTill) {
                    returnResponse = await questionCampaignService.addTimeAccessSetting(formData);
                }
                else {
                    returnResponse = await responseHandler.failure('validfrom_not_smaller');
                }

            } catch (error) {
                returnResponse = responseHandler.catch_error(error);
            }
        }
        else {
            returnResponse = responseHandler.failure("request_body_incorrect", validation.errors.errors);
        }
        res.send(returnResponse);


    }


    async getQuestionCampaign(req, res) {
        let returnResponse = {};
        let formData = {
            questionCampaignId: req.query.questionCampaignId
        }

        let validation = new Validator(formData, { questionCampaignId: "required|string" });
        if (validation.passes() && !validation.fails()) {
            try {
                returnResponse = await questionCampaignService.getQuestionCampaign(formData.questionCampaignId);
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