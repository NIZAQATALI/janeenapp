// import mongoose from "mongoose";

// const courseSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String },
//     thumbnail: { type: String },

//     instructor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     price: { type: Number, default: 0 },
//     duration: { type: String }, 

//     level: {
//       type: String,
//       enum: ["Beginner", "Intermediate", "Advanced"],
//       default: "Beginner",
//     },
// pdf: { type: String },
//     category: { type: String }, 

//     lessons: [
//       {
//         title: String,
//         videoUrl: String,
//         content: String,
//         duration: Number, 
//       },
//     ],

//     isPublished: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Course", courseSchema);
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String },
  options: [{ type: String }],
  correctAnswer: { type: Number }, 
});

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["note", "gallery", "media", "quiz"],
    required: true,
  },

  heading: String,
  description: String,

  // For Gallery
  // images: [
  //   {
  //     url: String,
  //     description: String,
  //   },
  // ],
  images: [
  {
    url: String,
     public_id: { type: String, required: true },
    description: {
      type: [String],  
      default: []
    }
  }
],

  // For Media
  videoUrl: String,

  // For Quiz
  questions: [questionSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    thumbnail: String,
    pdf: String,

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: { type: Number, default: 0 },
    duration: String,

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    category: String,

    content: [contentBlockSchema],   

    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);