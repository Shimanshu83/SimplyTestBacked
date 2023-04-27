const mongoose = require('mongoose');

const answerSubmittedSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    choseAnswer: [
        {
            type: Number
        }
    ],
    pointsObtained: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('AnswerSubmitted', answerSubmittedSchema);
