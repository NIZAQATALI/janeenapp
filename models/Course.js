import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: { type: Number, default: 0 },
    duration: { type: String }, 

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
pdf: { type: String },
    category: { type: String }, 

    lessons: [
      {
        title: String,
        videoUrl: String,
        content: String,
        duration: Number, 
      },
    ],

    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
