

module.exports = class QuestionCampaign {
    constructor() { }
    async addBasicSetting(req, res, next) {
        // need to add code here it add's basic setting and then 
        // return question-campaign data. 
        // need to validate all the inputs if it's working or not perfectly 
        // using express validator 
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