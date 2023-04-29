const responses = require('./question-campaign.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const questionCampaignModel = require('../../models/question-campaign.model');

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

        let newQuestionCampaign = await new questionCampaignModel(formData).save();

        return responseHandler.success("question_campaign_added", { id: newQuestionCampaign._id });

    }
}