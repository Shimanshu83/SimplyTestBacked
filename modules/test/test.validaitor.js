module.exports = class testValidaitor {

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

    startTest() {
        return {
            questionCampaignId: "required|string",
            firstName: "required|string",
            lastName: "required|string",
            email: "required|email"
        };
    }

}