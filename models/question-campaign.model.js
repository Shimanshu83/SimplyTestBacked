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

    termsCodition: {
        type: String, required: true,
    },

    status: {
        type: String, enum: ['active', 'inactive', 'setupInProgress']
    },

    duration: {
        type: Number,
        required: true,
        min: 0
    },


    validFrom: {
        type: Date,
        required: true
    },
    validTill: {
        type: Date,
        required: true
    }



})