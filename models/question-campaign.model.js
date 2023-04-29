const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const questionCampaignSchema = new mongoose.Schema({
    testName: {
        type: String, required: true,
    },
    testCode: {
        type: String, required: true,
    },

    description: {
        type: String, required: true,
    },

    termsCondition: {
        type: String, required: true,
    },

    status: {
        type: String, enum: ['active', 'inactive', 'setupInProgress']
    },

    duration: {
        type: Number,
        min: 0
    },


    validFrom: {
        type: Date
    },
    validTill: {
        type: Date
    }

});


const questionCampaign = mongoose.model('questionCampaign', questionCampaignSchema)

module.exports = questionCampaign