import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

const sectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  points: [pointSchema]
});

const stageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  startMonth: Number,
  endMonth: Number,

  startWeek: Number,
  endWeek: Number,

  babySize: String,
  development: String,

  sections: [sectionSchema],

  tips: String
});

const contentCategorySchema = new mongoose.Schema(
{
  category: {
    type: String,
    enum: [
      "pre-planning",
      "pre-pregnancy",
      "pregnancy",
      "infant",
      "toddler"
    ],
    required: true
  },

  stages: [stageSchema],

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

export default mongoose.model("ContentCategory", contentCategorySchema);