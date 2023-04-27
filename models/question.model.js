const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const optionSchema = new mongoose.Schema({
    optionText: {
        type: String,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    }
});

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        required: true,
        enum: ['single', 'multiple']
    },
    correctAnswerPoint: {
        type: Number,
        required: true,
        default: 1
    },
    incorrectAnswerPoint: {
        type: Number,
        required: true,
        default: 0
    },
    options: [optionSchema]
});

module.exports = mongoose.model('Question', questionSchema);