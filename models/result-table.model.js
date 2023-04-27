const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  questionCampaignId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'QuestionCampaign'
  },
  userName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  },
  timeTaken: {
    type: Number,
    default: 0
  },
  noQuestionsAttempted: {
    type: Number,
    default: 0
  },
  submitted: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('ResultTable', resultSchema);
