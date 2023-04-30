const responses = require('./test.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const testValidaitor = new (require('./test.validaitor'))();
const Validator = require('validatorjs');
const testService = new (require('./test.service'))();


module.exports = class testController {
    constructor() { }


    async getBasicQuestionCampaignInfo(req, res) {


    }
    async testStart(req, res) {


    }
    async testSubmitted(req, res) {


    }

}