import Course from "../models/Course.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      level,
      category,
      isPublished,
    } = req.body;
    const file = req.file;
    let thumbnailUrl = null;
      console.log(req.file)
    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file.buffer);
      if (cloudinaryResponse) {
        thumbnailUrl = cloudinaryResponse.secure_url;
        console.log(thumbnailUrl)
      } else {
        return res.status(500).json({
          success: false,
          message: "Thumbnail upload failed.",
        });
      }
    }
    const newCourse = new Course({
      title,
      description,
      price,
      duration,
      level,
      category,
      isPublished,
      instructor: req.user?._id,
      ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: savedCourse,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(500).json({
      success: false,
      message: "Course cannot be created.",
      error: err.message,
    });
  }
};

// export const getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find()
//       .populate("instructor", "username email");

//     res.status(200).json({
//       success: true,
//       count: courses.length,
//       data: courses,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
import Enrollment from "../models/enrollment.js";
import QuizAttempt from "../models/quizAttempt.js";

export const getAllCourses = async (req, res) => {
  try {

    const userId = req.user?._id; // if logged in

    // 1️⃣ get all courses
    const courses = await Course.find()
      .populate("instructor", "username email");

    let enrolledCourseIds = [];

    // 2️⃣ get enrollments of user
    if (userId) {
      const enrollments = await Enrollment.find({ user: userId });

      enrolledCourseIds = enrollments.map(
        (enroll) => enroll.course.toString()
      );
    }

    // 3️⃣ add flag
    const updatedCourses = courses.map((course) => {

      const courseObj = course.toObject();

      courseObj.isEnrolled = enrolledCourseIds.includes(
        course._id.toString()
      );

      return courseObj;
    });

    res.status(200).json({
      success: true,
      count: updatedCourses.length,
      data: updatedCourses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "username email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateCourse = async (req, res) => {
  const _id = req.params.id;   // same pattern as user
  console.log(req.params,"id.....................")
  const file = req.file?.buffer;
  let thumbnailUrl = null;

  try {
    // Upload thumbnail if provided
    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file, "courses");

      if (cloudinaryResponse) {
        thumbnailUrl = cloudinaryResponse.secure_url;
      } else {
        return res.status(500).json({
          status: "failed",
          success: false,
          message: "Thumbnail upload failed. Course not updated.",
        });
      }
    }

    // Spread body data
    const updateData = { ...req.body };
console.log(req.body,"updateData")
    // If thumbnail uploaded, attach it
    if (thumbnailUrl) updateData.thumbnail = thumbnailUrl;

    const updatedCourse = await Course.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true}
    );
console.log(updatedCourse,"updatedCourse")
    if (!updatedCourse) {
      return res.status(404).json({
        status: "failed",
        success: false,
        message: "Course not found. Update failed.",
      });
    }

    res.status(200).json({
      status: "success",
      success: true,
      message: "Course successfully updated",
      data: updatedCourse,
    });

  } catch (err) {
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Course cannot be updated. Try again.",
      error: err.message,
    });
  }
};

export const updateCoursePdf = async (req, res) => {
  const _id = req.params.id;
  const file = req.file?.buffer;
  let pdfUrl = null;

  try {
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required.",
      });
    }
    const cloudinaryResponse = await uploadOnCloudinary(file, "courses/pdfs");
    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "PDF upload failed.",
      });
    }

    pdfUrl = cloudinaryResponse.secure_url;

    const updatedCourse = await Course.findByIdAndUpdate(
      _id,
      { $set: { pdf: pdfUrl } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course PDF uploaded successfully.",
      data: updatedCourse,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Course PDF cannot be uploaded.",
      error: err.message,
    });
  }
};
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }


};
// export const addNoteBlock = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { heading, description } = req.body;

//     const course = await Course.findById(id);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     course.content.push({
//       type: "note",
//       heading,
//       description,
//     });

//     await course.save();

//     res.status(200).json({
//       success: true,
//       message: "Note block added",
//       data: course,
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const addNoteBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, heading } = req.body; // notes = array of {heading, description}

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Validate notes array
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ success: false, message: "Notes are required" });
    }

    course.content.push({
      type: "note",
      heading: heading || "Notes",
      notes, // array of note objects
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Note block added successfully",
      data: course,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const addMediaBlock = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const upload = await uploadOnCloudinary(req.file.buffer, "courses/videos");

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.content.push({
      type: "media",
      heading: req.body.heading || "Video Lecture",
      videoUrl: upload.secure_url,
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Media block added",
      data: course,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// export const addGalleryBlock = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Images are required",
//       });
//     }

//     const uploadedImages = [];

//     for (let file of req.files) {
//       const upload = await uploadOnCloudinary(file.buffer, "courses/gallery");

//       uploadedImages.push({
//         url: upload.secure_url,
//         description: req.body.description || "Slide Image",
//       });
//     }

//     const course = await Course.findById(id);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     course.content.push({
//       type: "gallery",
//       heading: req.body.heading || "Gallery",
//       images: uploadedImages,
//     });

//     await course.save();

//     res.status(200).json({
//       success: true,
//       message: "Gallery block added",
//       data: course,
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const addGalleryBlock = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // 2️⃣ Find course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 3️⃣ Parse descriptions safely
    let descriptionsArray = [];

    if (req.body.descriptions) {
      try {
        console.log(req.body.descriptions,"req.body.descriptions...............")
        descriptionsArray = JSON.parse(req.body.descriptions);

        if (!Array.isArray(descriptionsArray)) {
          descriptionsArray = [];
        }

      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid descriptions JSON format",
        });
      }
    }

    // 4️⃣ Upload images
    const uploadedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      const upload = await uploadOnCloudinary(
        file.buffer,
        "courses/gallery"
      );

      if (!upload) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }

      uploadedImages.push({
        url: upload.secure_url,
        public_id: upload.public_id,
        description: descriptionsArray[i] || [], // per image points
      });
    }

    // 5️⃣ Push gallery block
    course.content.push({
      type: "gallery",
      heading: req.body.heading || "Gallery",
      images: uploadedImages,
    });

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Gallery block added successfully",
      data: course,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Gallery block creation failed",
      error: err.message,
    });
  }
};
export const addQuizBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, questions } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.content.push({
      type: "quiz",
      heading,
      questions,
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Quiz block added",
      data: course,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const deleteContentBlock = async (req, res) => {
  try {
    const { id, contentId } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.content = course.content.filter(
      (block) => block._id.toString() !== contentId
    );

    await course.save();

    res.status(200).json({
      success: true,
      message: "Content block deleted",
      data: course,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const updateContentBlock = async (req, res) => {
  try {
    const { id, contentId } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const block = course.content.id(contentId);
    if (!block) {
      return res.status(404).json({
        success: false,
        message: "Content block not found",
      });
    }

    /* ----------------------------------
       UPDATE TEXT FIELDS (ALL TYPES)
    ---------------------------------- */
    if (req.body.heading !== undefined) {
      block.heading = req.body.heading;
    }

    if (req.body.description !== undefined) {
      block.description = req.body.description;
    }

    /* ----------------------------------
       UPDATE NOTE TYPE
    ---------------------------------- */
    // if (block.type === "note") {
    //   if (req.body.description !== undefined) {
    //     block.description = req.body.description;
    //   }
    // }
    if (block.type === "note" && req.body.notes) {
  block.notes = req.body.notes; // replace old notes
}

    /* ----------------------------------
       UPDATE QUIZ TYPE
    ---------------------------------- */
    if (block.type === "quiz") {
      if (req.body.questions) {
        block.questions = req.body.questions;
      }
    }

    /* ----------------------------------
       UPDATE MEDIA TYPE (Replace Video)
    ---------------------------------- */
    if (block.type === "media" && req.files?.media) {
      const videoFile = req.files.media[0].buffer;

      const upload = await uploadOnCloudinary(videoFile, "courses/videos");

      if (!upload) {
        return res.status(500).json({
          success: false,
          message: "Video upload failed",
        });
      }

      block.videoUrl = upload.secure_url;
    }

    /* ----------------------------------
       UPDATE GALLERY TYPE (Replace Images)
    ---------------------------------- */
    // if (block.type === "gallery" && req.files?.images) {
    //   const uploadedImages = [];

    //   for (let file of req.files.images) {
    //     const upload = await uploadOnCloudinary(
    //       file.buffer,
    //       "courses/gallery"
    //     );

    //     uploadedImages.push({
    //       url: upload.secure_url,
    //       description: req.body.imageDescription || "Slide Image",
    //     });
    //   }

    //   block.images = uploadedImages;
    // }
  if (block.type === "gallery") {
      // Parse descriptions JSON array
      let descriptionsArray = [];
      if (req.body.descriptions) {
        try {
          descriptionsArray = JSON.parse(req.body.descriptions);
          if (!Array.isArray(descriptionsArray)) descriptionsArray = [];
        } catch {
          return res.status(400).json({
            success: false,
            message: "Invalid descriptions JSON format",
          });
        }
      }

      // Delete old images if new ones uploaded
      if (req.files?.images && block.images.length > 0) {
        for (let img of block.images) {
          if (img.public_id) await deleteOnCloudinary(img.public_id);
        }
      }

      const uploadedImages = [];
      if (req.files?.images) {
        for (let i = 0; i < req.files.images.length; i++) {
          const file = req.files.images[i];
          const upload = await uploadOnCloudinary(file.buffer, "courses/gallery");
          uploadedImages.push({
            url: upload.secure_url,
            public_id: upload.public_id,
            description: descriptionsArray[i] || [],
          });
        }
        block.images = uploadedImages;
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Content block updated successfully",
      data: course,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Content update failed",
      error: err.message,
    });
  }
};

//   try {
//     const { id, contentId } = req.params;

//     const course = await Course.findById(id);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     const block = course.content.id(contentId);
//     if (!block) {
//       return res.status(404).json({
//         success: false,
//         message: "Content block not found",
//       });
//     }

//     Object.assign(block, req.body);

//     await course.save();

//     res.status(200).json({
//       success: true,
//       message: "Content block updated",
//       data: course,
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const getCourseQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    const quizBlock = course.content.find(
      (c) => c.type === "quiz"
    );
    if (!quizBlock) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
    // remove correctAnswer
    const questions = quizBlock.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));

    res.status(200).json({
      success: true,
      data: questions
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};
export const submitQuiz = async (req, res) => {
  try {

    const userId = req.user._id;
    const { courseId } = req.params;
    const { answers } = req.body;

    const course = await Course.findById(courseId);

    const quizBlock = course.content.find(
      (c) => c.type === "quiz"
    );

    if (!quizBlock) {
      return res.status(404).json({
        success:false,
        message:"Quiz not found"
      })
    }

    let score = 0;

    for (const answer of answers) {
      const question = quizBlock.questions.id(answer.questionId);
      if (!question) continue;
      if (question.correctAnswer === answer.selectedOption) {
        score += 1;
      }
    }
    const totalQuestions = quizBlock.questions.length;
    const attempt = await QuizAttempt.create({
      user: userId,
      course: courseId,
      answers,
      score,
      totalQuestions
    });

    res.status(200).json({
      success:true,
      message:"Quiz submitted",
      result:{
        score,
        totalQuestions
      },
      data:attempt
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};
export const getUserQuizResult = async (req, res) => {
  try {

    const userId = req.user._id;
    const { courseId } = req.params;

    const attempt = await QuizAttempt.findOne({
      user: userId,
      course: courseId
    })
    .populate("course", "title");

    if (!attempt) {
      return res.status(404).json({
        success:false,
        message:"Quiz not attempted"
      });
    }

    res.status(200).json({
      success:true,
      data: attempt
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};
export const getCourseQuizResults = async (req, res) => {
  try {

    const { courseId } = req.params;

    const results = await QuizAttempt.find({
      course: courseId
    })
    .populate("user", "username email")
    .populate("course", "title");

    res.status(200).json({
      success:true,
      count: results.length,
      data: results
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};