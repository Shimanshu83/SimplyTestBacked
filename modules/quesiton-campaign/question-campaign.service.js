const responses = require('./question-campaign.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const questionCampaignModel = require('../../models/question-campaign.model');
const questionModel = require('../../models/question.model');

module.exports = class questionCampaignService {
    constructor() { }

    async basicSetting(formData) {
        let isTestCodeExists = questionCampaignModel.find({ testCode: formData.testCode });
        let isTestNameExists = questionCampaignModel.find({ testName: formData.testName });
        let isDuplicateDataExists = await Promise.all([isTestCodeExists, isTestNameExists]);

        let isBasicSettingExistsError = [];
        isDuplicateDataExists.forEach((value, id) => {
            if (value.length > 0) {
                switch (id) {
                    case 0:
                        isBasicSettingExistsError.push('Test Code already exists');
                        break;
                    case 1:
                        isBasicSettingExistsError.push('Test Name already exists');
                    default:
                        break;
                }
            }
        })

        if (isBasicSettingExistsError.length > 0) {
            return responseHandler.failure("data_already_exists", isBasicSettingExistsError);
        }

        // setting status as setupInProgress 

        formData['status'] = "setupInProgress";

        let newQuestionCampaign = await new questionCampaignModel(formData).save();

        return responseHandler.success("basic_setting_added", { id: newQuestionCampaign._id });

    }


    async editBasicSetting(formData) {

        let updatedQuestionCampaign = await questionCampaignModel.findByIdAndUpdate(
            formData.id, { ...formData }, { new: true }
        );

        return responseHandler.success("basic_setting_updated", updatedQuestionCampaign);
    }


    async addQuestion(formData) {
        let newQuestion = await new questionModel(formData).save();
        return responseHandler.success("question_added", newQuestion);
    }

    async editQuestion(formData) {
        let questionId = formData.id;
        delete formData.id;
        let updatedQuestion = await questionModel.findByIdAndUpdate(
            questionId, formData, { new: true }
        )

        return responseHandler.success("question_updated", updatedQuestion);

    }


    async addTimeAccessSetting(formData) {

        let questionCampaignId = formData.questionCampaignId;
        delete formData.questionCampaignId;
        let updatedQuestionCampaign = await questionCampaignModel.findByIdAndUpdate(
            questionCampaignId, { ...formData }, { new: true }
        );

        return responseHandler.success("time_access_setting_updated", updatedQuestionCampaign);

    }

    async getQuestionCampaign(questionCampaignId) {

        let questionCampaignData = await questionCampaignModel.findById(questionCampaignId);
        let questionCampaignQuestionData = await questionModel.find({ questionCampaignId: questionCampaignId });



        return responseHandler.success("question_campaign_data", { ...questionCampaignData['_doc'], questions: questionCampaignQuestionData });
    }
}