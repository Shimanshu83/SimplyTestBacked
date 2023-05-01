const responses = require('./test.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const questionCampaignModel = require('../../models/question-campaign.model');
const questionModel = require('../../models/question.model');
const resultModel = require('../../models/result-table.model');
const answerSubmittedModel = require('../../models/answer-submitted.model');


module.exports = class testService {
    constructor() { }

    async getBasicQuestionCampaignInfo(questionCampaignId) {
        // need to check if this questionCampaignExist or not 
        let questionCampaignData = await questionCampaignModel.findById(questionCampaignId);

        if (!questionCampaignData) {
            return responseHandler.failure('question_campaign_doesnot_exist');
        }

        if (questionCampaignData.status !== 'active') {
            return responseHandler.failure('question_campaign_is_inactive');
        }

        console.log(questionCampaignData)
        return responseHandler.success('question_campaign_data_found', questionCampaignData);
        // check the status campaign  
    }


    async testStart(formData) {
        // need to check if this questionCampaignExist or not 
        let questionCampaignData = await questionCampaignModel.findById(formData.questionCampaignId);

        if (!questionCampaignData) {
            return responseHandler.failure('question_campaign_doesnot_exist');
        }

        if (questionCampaignData.status === 'active') {
            // need to check if the test is with in the validFrom and ValidTill plus duration 
            let validFrom = new Date(questionCampaignData.validFrom);
            let validTill = new Date(questionCampaignData.validTill);
            let currentTime = new Date();
            // checking if the test is between validfrom or valid till
            if (currentTime.getTime() < validFrom.getTime() &&
                (currentTime.getTime() + questionCampaignData.duration * 60000) > validTill.getTime()
            ) {
                return responseHandler.failure("question_campaign_timing_passed");
            }
        }
        else {
            return responseHandler.failure('question_campaign_is_inactive');
        }

        // check if email exists in the table and if exist and  check if answer is submitted or not. 
        let emailExists = await resultModel.find({ email: formData.email, submitted: true, questionCampaignId: formData.questionCampaignId });

        if (emailExists.length > 0) {
            return responseHandler.failure("test_already_submitted");
        }

        //save the details on result table 
        let resultTableDataSaved = await new resultModel(formData).save();

        let questionCampaignQuestionData = await questionModel.find({ questionCampaignId: formData.questionCampaignId });

        let answerSubmittedArray = questionCampaignQuestionData.map(question => {
            return {
                questionId: formData.questionCampaignId,
                resultTable: resultTableDataSaved._id
            };
        });

        let data = await answerSubmittedModel.insertMany(answerSubmittedArray);

        // need to do mapping here so that both the answer key and data should be there 

        let finalQuestionData = questionCampaignQuestionData.map((question, index) => {

            question['options'] = question.options.map(option => {
                delete option['_doc'].selected;
                return option;
            })

            return { ...question['_doc'], answerId: data[index]._id };
        });

        return responseHandler.success('question_campaign_data_found', { ...questionCampaignData['_doc'], finalQuestionData });



    }



    async submitSingleAnswer(formData) {

        // need to check if this exist or not 
        // if exist we will find the question Id and compare if the 
        // options selected are right or not 
        // there will be no partial points if all options are selected right then we will 
        // assign the points as mentioned else we will do deduct point 
        // jo tunai sochi na hogi 

        // check if answerId exists 
        let answerObject = await answerSubmittedModel.findById(formData.answerId);

        if (!answerObject) {
            throw new Error('answer_obj_not_found');
        }

        // need to get the questionObject and compare if the answer selected is right or not 

        let questionObject = questionModel.findById(answerObject.questionId);

        if (!questionObject) {
            throw new Error('question_obj_not_found');
        }


    }

    /**
     * 
     * @param {*} qeustionObject this is question doc
     * @param {*} optionSelectedArray answer selected by user 
     * Our objective is to calculate point on the basis of usersAnswerSelection and right answers .
     */
    isRightOptionSelected(qeustionObject, optionSelectedArray) {
        let rightAnswerArray = qeustionObject['options'].reduce(
            (rightAnswerArrayId, option) => {
                if (option['selected'] === true) {
                    rightAnswerArrayId.push(option['_id'])
                }
            }, []
        );


        if (rightAnswerArray.length !== optionSelectedArray.length) {
            return false;
        }

        let isAnswerSelectedCorrect = true;

        for (let answerId of rightAnswerArray) {
            if (!optionSelectedArray.includes(answerId)) {
                isAnswerSelectedCorrect = false;
                break
            }
        }

        return isAnswerSelectedCorrect;
    }
}