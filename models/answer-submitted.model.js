const mongoose = require('mongoose');

const answerSubmittedSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },


    resultTable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ResultTable'
    },

    choseAnswer: [
        {
            type: String
        }
    ],
    pointsObtained: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('AnswerSubmitted', answerSubmittedSchema);
