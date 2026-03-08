import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  answers: [
    {
      questionId: String,
      selectedOption: Number
    }
  ],

  score: {
    type: Number,
    default: 0
  },

  totalQuestions: Number,

  attemptedAt: {
    type: Date,
    default: Date.now
  }

},
{ timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);