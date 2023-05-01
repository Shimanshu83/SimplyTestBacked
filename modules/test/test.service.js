const responses = require('./test.response');
const responseHandler = new (require('../../util/baseResponse'))(responses);
const questionCampaignModel = require('../../models/question-campaign.model');
const questionModel = require('../../models/question.model');
const resultModel = require('../../models/result-table.model');
const answerSubmittedModel = require('../../models/answer-submitted.model');
// const resultTableModel = require('../../models/result-table.model');


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
                questionId: question._id,
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

        let questionObject = await questionModel.findById(answerObject.questionId);

        if (!questionObject) {
            throw new Error('question_obj_not_found');
        }

        let pointsObtained = 0;

        if (this.isRightOptionSelected(questionObject, formData.optionSelectedArray)) {
            pointsObtained = questionObject['_doc'].correctAnswerPoint;
        }
        else {
            pointsObtained = questionObject['_doc'].incorrectAnswerPoint;
        }

        // update the answerSubmitted doc and sent the updated doc 

        let updateSubmittedDoc = await answerSubmittedModel.findByIdAndUpdate(formData.answerId, {
            "choseAnswer": formData.optionSelectedArray,
            "pointsObtained": pointsObtained
        }, { new: true });

        return responseHandler.success("answer_updated_successfully", updateSubmittedDoc);
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
                    rightAnswerArrayId.push((option._id) + '')
                }
                return rightAnswerArrayId
            }, []
        );


        if (rightAnswerArray.length !== optionSelectedArray.length) {
            return false;
        }

        let isAnswerSelectedCorrect = true;

        for (let answerId of rightAnswerArray) {
            console.log(answerId);
            if (!optionSelectedArray.includes(answerId)) {
                isAnswerSelectedCorrect = false;
                break
            }
        }

        return isAnswerSelectedCorrect;
    }


    async submitTest(formData) {
        // first we will check if the result table exist or not 
        // check if it's already not submitted 
        // then we need to check if submission time is within attempted at  and attempted at + exam duration 
        // if valid then we will save timeTaken submittedAt 
        // then we will calculate the overall points and questionAttempted at. 

        let resultTableData = await resultModel.findById(formData.resultTableId);
        let questionCampaignData = await questionCampaignModel.findById(formData.questionCampaignId);


        if (!resultTableData) {
            return responseHandler.failure("no_result_table_record_found");
        }

        // how much time does it take to complete the test 
        // this value will be in minutes and an Integer 
        let timeTaken = 0;

        if (resultTableData.submitted === false) {
            let currentTime = Date.now();
            let attemptedAt = new Date(resultTableData.attemptedAt).getTime();
            // adding one more minute considering network delays 
            if ((attemptedAt + (questionCampaignData.duration * 60000) + 60000) < currentTime) {
                return responseHandler.failure("test_time_passed");
            }
            else {

                timeTaken = Math.floor(((currentTime - attemptedAt) / 60000));

            }
        }
        else {
            return responseHandler.failure("test_already_submitted");
        }

        // get all the answers from the answers table with same resulTableId  
        // and then calculate all other stats 

        let allAnswersDataArray = await answerSubmittedModel.find({ resultTable: formData.resultTableId });

        // write a function which 

        let answerStatsData = this.answerStatsMethod(allAnswersDataArray);

        //last submition to the result table 

        let resultTableSubmission = await resultModel.findByIdAndUpdate(formData.resultTableId,
            { ...answerStatsData, timeTaken: timeTaken, submitted: true, submittedAt: new Date() },
            { new: true }
        );

        return responseHandler.success("test_submitted_successfully", resultTableSubmission);
    }


    /**
     * 
     * @param {*} allAnswerDataArray 
     * 
     * returns an object with the definations as below 
     * {
     *  totalScore : 12 , 
     *  noQuestionAttempted : 12 , 
     *  noRightAnswerChoosed :  , 
     *  noWrongAnswerChoosed : , 
     *  noQuestionSkipped : , 
     * 
     * }
     */
    answerStatsMethod(allAnswerDataArray) {
        let answerStats = {
            totalScore: 0,
            noQuestionAttempted: 0,
            noRightAnswerChoosed: 0,
            noWrongAnswerChoosed: 0,
            noQuestionSkipped: 0,
        }

        for (let answer of allAnswerDataArray) {

            if (answer.choseAnswer !== undefined && answer.choseAnswer !== null && answer.choseAnswer.length > 0) {
                answerStats.totalScore += answer.pointsObtained;
                answerStats.noQuestionAttempted += 1;
                if (answer.pointsObtained > 0) {
                    answerStats.noRightAnswerChoosed += 1;
                }
                else {
                    answerStats.noWrongAnswerChoosed += 1;
                }
            }
            else {
                answerStats.noQuestionSkipped += 1;
            }
        }

        return answerStats;

    }


}