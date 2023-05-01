module.exports = class questionCampaignValidaitor {

    constructor() { }

    basicSettingValidaitor() {
        return {
            testName: "required|between:3,30",
            testCode: "required|between:3,30",
            description: "required|between:3,30",
            termsCondition: "required|between:3,30",
            id: "required",
        };
    }


    addQuestion() {
        return {
            questionCampaignId: "required|string",
            questionText: "required|string",
            questionType: "in:single,multiple",
            correctAnswerPoint: "required|integer",
            incorrectAnswerPoint: "required|integer",
            "options.*.optionText": "required|string",
            "options.*.selected": "required|boolean"
        };
    }

    addTimeAccessSetting() {
        return {
            validFrom: "required|date",
            validTill: "required|date",
            duration: "required|integer",
            status: "required|in:active,inactive",
            questionCampaignId: "required|string"
        };
    }


}