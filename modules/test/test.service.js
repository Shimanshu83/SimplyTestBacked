const responses = require('./test.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const questionCampaignModel = require('../../models/question-campaign.model');
const questionModel = require('../../models/question.model');
const resultModel = require('../../models/result-table.model');
const answerSubmittedModel = require('../../models/answer-submitted.model');


module.exports = class testService {
    constructor() { }


}