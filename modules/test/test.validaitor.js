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

}